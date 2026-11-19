create table creations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  creator_name text not null,
  tools text,
  commercial_ok boolean not null default false,
  image_url text not null,
  category text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table visitors (
  id uuid primary key default gen_random_uuid(),
  first_seen timestamptz not null default now(),
  utm_source text
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references visitors(id),
  started_at timestamptz not null default now()
);

create table events (
  id bigserial primary key,
  visitor_id uuid not null references visitors(id),
  session_id uuid not null references sessions(id),
  creation_id uuid not null references creations(id),
  action text not null check (action in ('like','pass','save','share','details')),
  dwell_ms integer not null default 0,
  created_at timestamptz not null default now()
);
create index on events (creation_id);
create index on events (visitor_id, created_at);

create table impressions (
  id bigserial primary key,
  visitor_id uuid not null references visitors(id),
  session_id uuid not null references sessions(id),
  creation_id uuid not null references creations(id),
  created_at timestamptz not null default now(),
  unique (visitor_id, creation_id)
);
create index on impressions (creation_id);

alter table creations enable row level security;
alter table visitors enable row level security;
alter table sessions enable row level security;
alter table events enable row level security;
alter table impressions enable row level security;

-- per-creation stats; reflex noise (dwell < 400ms) excluded
create view creation_stats with (security_invoker = true) as
select
  c.id as creation_id,
  c.category,
  (select count(*) from impressions i where i.creation_id = c.id) as impressions,
  (select count(*) from events e where e.creation_id = c.id and e.action = 'like' and e.dwell_ms >= 400) as likes,
  (select count(*) from events e where e.creation_id = c.id and e.action = 'pass' and e.dwell_ms >= 400) as passes,
  (select count(*) from events e where e.creation_id = c.id and e.action = 'save') as saves,
  (select count(*) from impressions i where i.creation_id = c.id and i.created_at >= date_trunc('day', now())) as impressions_today
from creations c
where c.active;
revoke all on creation_stats from anon, authenticated;
