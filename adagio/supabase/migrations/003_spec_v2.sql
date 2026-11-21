-- Aligns the schema with PROTOTYPE_SPEC.md (love/next actions, love-rate stats) and adds creators.

-- creators (contact_email is private: never selected by any API route)
create table if not exists creators (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  portfolio_url text check (portfolio_url is null or portfolio_url ~* '^https?://'),
  contact_email text,
  created_at timestamptz not null default now()
);
alter table creators enable row level security;
revoke all on creators from anon, authenticated;

alter table creations add column if not exists creator_id uuid references creators(id);
create unique index if not exists creations_image_url_key on creations (image_url);

-- actions: next / love / save / share / details
alter table events drop constraint if exists events_action_check;
update events set action = 'next' where action = 'pass';
update events set action = 'love' where action = 'like';
alter table events add constraint events_action_check
  check (action in ('next','love','save','share','details'));

-- one love per creation per visitor
create unique index if not exists events_one_love_per_visitor
  on events (visitor_id, creation_id) where action = 'love';

-- stats: a meaningful impression is a (visitor, creation) pair with a `next` of dwell >= 400ms or any love.
-- A love is deliberate, so it is never reflex noise and loves <= meaningful impressions always.
drop view if exists creation_stats;
create view creation_stats with (security_invoker = true) as
select
  c.id as creation_id,
  c.category,
  (select count(*) from impressions i where i.creation_id = c.id) as impressions,
  (select count(*) from (
     select visitor_id from events e
     where e.creation_id = c.id and ((e.action = 'next' and e.dwell_ms >= 400) or e.action = 'love')
     group by visitor_id) m) as meaningful_impressions,
  (select count(*) from events e where e.creation_id = c.id and e.action = 'love') as loves,
  (select count(*) from events e where e.creation_id = c.id and e.action = 'save') as saves,
  (select count(*) from impressions i where i.creation_id = c.id and i.created_at >= date_trunc('day', now())) as impressions_today,
  (select count(*) from events e where e.creation_id = c.id and e.action = 'love')::float8
    / nullif((select count(*) from (
        select visitor_id from events e
        where e.creation_id = c.id and ((e.action = 'next' and e.dwell_ms >= 400) or e.action = 'love')
        group by visitor_id) m2), 0) as love_rate
from creations c
where c.active;
revoke all on creation_stats from anon, authenticated;

-- defense in depth on top of RLS: the browser roles get no table or sequence privileges at all
revoke all on creations, visitors, sessions, events, impressions, creators from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
