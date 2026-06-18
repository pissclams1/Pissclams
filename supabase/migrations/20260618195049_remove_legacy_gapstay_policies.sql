drop policy if exists "GapStay inquiries public insert" on public.gapstay_inquiries;
drop policy if exists "gapstay public insert inquiries" on public.gapstay_inquiries;
drop policy if exists "GapStay inquiries public readable" on public.gapstay_inquiries;
drop policy if exists "gapstay public read inquiries" on public.gapstay_inquiries;

drop policy if exists "GapStay listings public insert" on public.gapstay_listings;
drop policy if exists "gapstay public insert listings" on public.gapstay_listings;
drop policy if exists "GapStay listings are public readable" on public.gapstay_listings;
drop policy if exists "gapstay public read listings" on public.gapstay_listings;

drop policy if exists "gapstay_payments_insert" on public.gapstay_payments;
drop policy if exists "gapstay_payments_select" on public.gapstay_payments;
