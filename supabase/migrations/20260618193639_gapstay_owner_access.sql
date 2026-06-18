create extension if not exists pgcrypto with schema extensions;

alter table public.gapstay_listings
  add column if not exists owner_token_hash text,
  add column if not exists source_url text,
  add column if not exists image_url text,
  add column if not exists rating text,
  add column if not exists reviews text,
  add column if not exists guest_count text,
  add column if not exists nightly_rate text;

drop policy if exists "gapstay owners can create listings" on public.gapstay_listings;
drop policy if exists "gapstay listings are visible to owner or public" on public.gapstay_listings;
drop policy if exists "gapstay owners can update listings" on public.gapstay_listings;
drop policy if exists "gapstay guests can submit inquiries" on public.gapstay_inquiries;
drop policy if exists "gapstay owners can view inquiries" on public.gapstay_inquiries;
drop policy if exists "gapstay owners can record payments" on public.gapstay_payments;
drop policy if exists "gapstay owners can view payments" on public.gapstay_payments;

create policy "gapstay owners can create listings"
on public.gapstay_listings for insert to anon, authenticated
with check (
  owner_token_hash = encode(extensions.digest(coalesce(current_setting('request.headers', true)::jsonb ->> 'x-gapstay-owner-token', ''), 'sha256'), 'hex')
);

create policy "gapstay listings are visible to owner or public"
on public.gapstay_listings for select to anon, authenticated
using (
  publish_status = 'published'
  or owner_token_hash = encode(extensions.digest(coalesce(current_setting('request.headers', true)::jsonb ->> 'x-gapstay-owner-token', ''), 'sha256'), 'hex')
);

create policy "gapstay owners can update listings"
on public.gapstay_listings for update to anon, authenticated
using (
  owner_token_hash = encode(extensions.digest(coalesce(current_setting('request.headers', true)::jsonb ->> 'x-gapstay-owner-token', ''), 'sha256'), 'hex')
)
with check (
  owner_token_hash = encode(extensions.digest(coalesce(current_setting('request.headers', true)::jsonb ->> 'x-gapstay-owner-token', ''), 'sha256'), 'hex')
);

create policy "gapstay guests can submit inquiries"
on public.gapstay_inquiries for insert to anon, authenticated
with check (
  exists (
    select 1 from public.gapstay_listings
    where gapstay_listings.id = gapstay_inquiries.listing_id
      and gapstay_listings.publish_status = 'published'
  )
);

create policy "gapstay owners can view inquiries"
on public.gapstay_inquiries for select to anon, authenticated
using (
  exists (
    select 1 from public.gapstay_listings
    where gapstay_listings.id = gapstay_inquiries.listing_id
      and gapstay_listings.owner_token_hash = encode(extensions.digest(coalesce(current_setting('request.headers', true)::jsonb ->> 'x-gapstay-owner-token', ''), 'sha256'), 'hex')
  )
);

create policy "gapstay owners can record payments"
on public.gapstay_payments for insert to anon, authenticated
with check (
  listing_id is not null and exists (
    select 1 from public.gapstay_listings
    where gapstay_listings.id = gapstay_payments.listing_id
      and gapstay_listings.owner_token_hash = encode(extensions.digest(coalesce(current_setting('request.headers', true)::jsonb ->> 'x-gapstay-owner-token', ''), 'sha256'), 'hex')
  )
);

create policy "gapstay owners can view payments"
on public.gapstay_payments for select to anon, authenticated
using (
  listing_id is not null and exists (
    select 1 from public.gapstay_listings
    where gapstay_listings.id = gapstay_payments.listing_id
      and gapstay_listings.owner_token_hash = encode(extensions.digest(coalesce(current_setting('request.headers', true)::jsonb ->> 'x-gapstay-owner-token', ''), 'sha256'), 'hex')
  )
);
