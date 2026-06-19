import { NextResponse } from "next/server";
import { gapStayHeaders, gapStayRest } from "../../../../lib/gapstay-server";
import { evaluateMonitor } from "../../../../lib/monitoring";

function isAuthorized(request: Request) {
  const secret = process.env.GAPSTAY_CRON_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });

  const response = await fetch(gapStayRest("gapstay_monitors?active=eq.true&select=*&limit=25"), {
    headers: gapStayHeaders(),
    cache: "no-store"
  });
  const monitors = await response.json().catch(() => []);
  if (!response.ok) return NextResponse.json({ ok: false, message: "Could not load monitors.", error: monitors }, { status: 500 });

  const results = [];
  for (const monitor of monitors) {
    const evaluation = await evaluateMonitor({
      sourceUrl: monitor.source_url,
      title: monitor.listing_title,
      city: monitor.city,
      state: monitor.state,
      propertyType: monitor.property_type,
      bedrooms: monitor.bedrooms,
      bathrooms: monitor.bathrooms,
      nightlyRate: monitor.nightly_rate,
      cleaningFee: monitor.cleaning_fee
    });
    const alert = evaluation.findings.find(f => f.shouldAlert);
    const status = alert ? "needs_alert" : "checked";

    await fetch(gapStayRest(`gapstay_monitors?id=eq.${encodeURIComponent(monitor.id)}`), {
      method: "PATCH",
      headers: gapStayHeaders(),
      body: JSON.stringify({
        last_checked_at: new Date().toISOString(),
        last_alert_hash: alert ? alert.alertHash : monitor.last_alert_hash || null,
        last_alert_at: alert ? new Date().toISOString() : monitor.last_alert_at || null,
        updated_at: new Date().toISOString()
      })
    });

    results.push({ id: monitor.id, ok: evaluation.ok, findings: evaluation.findings.length, status, firstAlert: alert || null });
  }

  return NextResponse.json({ ok: true, checked: results.length, results });
}
