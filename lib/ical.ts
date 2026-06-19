export type CalendarGap = {
  start: string;
  end: string;
  nights: number;
};

export type CalendarResult = {
  ok: boolean;
  listingId: string | null;
  bookedRanges: { start: string; end: string }[];
  gaps: CalendarGap[];
  nextGap: CalendarGap | null;
  error?: string;
};

function toYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseICalDate(raw: string): Date {
  const s = raw.replace(/T.*/, "");
  return new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T12:00:00Z`);
}

function nightsBetweenDates(a: Date, b: Date): number {
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

export function parseICalFeed(icsText: string): { start: Date; end: Date }[] {
  const events: { start: Date; end: Date }[] = [];
  const lines = icsText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  let inEvent = false;
  let dtstart = "";
  let dtend = "";

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      dtstart = "";
      dtend = "";
    }
    if (line === "END:VEVENT") {
      inEvent = false;
      if (dtstart && dtend) {
        try {
          events.push({ start: parseICalDate(dtstart), end: parseICalDate(dtend) });
        } catch {}
      }
    }
    if (inEvent) {
      if (line.startsWith("DTSTART")) dtstart = line.split(":").slice(1).join(":").trim();
      if (line.startsWith("DTEND")) dtend = line.split(":").slice(1).join(":").trim();
    }
  }
  return events;
}

export function findGaps(bookedEvents: { start: Date; end: Date }[], windowDays = 120): CalendarGap[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const windowEnd = new Date(today.getTime() + windowDays * 86400000);
  const sorted = [...bookedEvents].filter(e => e.end > today).sort((a, b) => a.start.getTime() - b.start.getTime());
  const gaps: CalendarGap[] = [];
  let cursor = new Date(today);

  for (const event of sorted) {
    if (event.start > cursor) {
      const gapEnd = event.start < windowEnd ? event.start : windowEnd;
      const nights = nightsBetweenDates(cursor, gapEnd);
      if (nights >= 7) gaps.push({ start: toYMD(cursor), end: toYMD(gapEnd), nights });
    }
    if (event.end > cursor) cursor = new Date(event.end);
  }

  if (cursor < windowEnd) {
    const nights = nightsBetweenDates(cursor, windowEnd);
    if (nights >= 7) gaps.push({ start: toYMD(cursor), end: toYMD(windowEnd), nights });
  }

  return gaps;
}

export function extractListingId(url: string): string | null {
  const airbnb = url.match(/airbnb\.com\/rooms\/(\d+)/);
  if (airbnb) return airbnb[1];
  const vrbo = url.match(/vrbo\.com\/(\d+)/);
  if (vrbo) return vrbo[1];
  return null;
}

export async function fetchCalendar(listingUrl: string): Promise<CalendarResult> {
  const listingId = extractListingId(listingUrl);
  if (!listingId) return { ok: false, listingId: null, bookedRanges: [], gaps: [], nextGap: null, error: "Could not extract listing ID from URL." };

  const isVrbo = listingUrl.includes("vrbo.com");
  const icalUrl = isVrbo ? `https://www.vrbo.com/icalendar/v2/${listingId}.ics` : `https://www.airbnb.com/calendar/ical/${listingId}.ics`;

  try {
    const res = await fetch(icalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GapStayBot/1.0; +https://gapstay.vercel.app)",
        Accept: "text/calendar,text/plain,*/*"
      },
      next: { revalidate: 0 }
    });

    if (!res.ok) return { ok: false, listingId, bookedRanges: [], gaps: [], nextGap: null, error: `Calendar feed returned ${res.status}` };
    const icsText = await res.text();
    if (!icsText.includes("BEGIN:VCALENDAR")) return { ok: false, listingId, bookedRanges: [], gaps: [], nextGap: null, error: "Response was not a valid iCal feed." };

    const events = parseICalFeed(icsText);
    const gaps = findGaps(events);
    const bookedRanges = events.map(e => ({ start: toYMD(e.start), end: toYMD(e.end) }));
    return { ok: true, listingId, bookedRanges, gaps, nextGap: gaps[0] || null };
  } catch (err) {
    return { ok: false, listingId, bookedRanges: [], gaps: [], nextGap: null, error: String(err) };
  }
}
