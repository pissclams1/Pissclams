-- Dwell-weighted passes for selection. Mirrors passWeight() in lib/distribution.ts:
-- 400ms -> 0.25, 3000ms+ -> 1.0. `passes` stays the raw meaningful count used by metrics.
create or replace view creation_stats with (security_invoker = true) as
select
  c.id as creation_id,
  c.category,
  (select count(*) from impressions i where i.creation_id = c.id) as impressions,
  (select count(*) from events e where e.creation_id = c.id and e.action = 'like' and e.dwell_ms >= 400) as likes,
  (select count(*) from events e where e.creation_id = c.id and e.action = 'pass' and e.dwell_ms >= 400) as passes,
  (select count(*) from events e where e.creation_id = c.id and e.action = 'save') as saves,
  (select count(*) from impressions i where i.creation_id = c.id and i.created_at >= date_trunc('day', now())) as impressions_today,
  (select coalesce(sum(0.25 + 0.75 * least(1, (e.dwell_ms - 400) / 2600.0)), 0)
     from events e where e.creation_id = c.id and e.action = 'pass' and e.dwell_ms >= 400) as weighted_passes
from creations c
where c.active;
revoke all on creation_stats from anon, authenticated;
