import { NextResponse } from "next/server";
import { gapStayHeaders, gapStayRest } from "../../../../lib/gapstay-server";
import { evaluateMonitor } from "../../../../lib/monitoring";
import { money, prettyDate } from "../../../../lib/pricing";
import { sendGapStayEmail } from "../../../../lib/email";

function isAuthorized(request: Request) {
  const secret = process.env.GAPSTAY_CRON_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

function alertEmailHtml(monitor: any, alert: any) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.55;color:#111;max-width:640px">
    <h1 style="font-size:24px;margin:0 0 12px">The answer changed.</h1>
    <p><strong>${monitor.listing_title || "Your listing"}</strong> has an unbooked range that needs a decision.</p>
    <p><strong>Range:</strong> ${prettyDate(alert.gap.startDate)} - ${prettyDate(alert.gap.endDate)} (${alert.gap.nights} nights)</p>
    <p><strong>Recommendation:</strong> ${alert.analysis.recommendation === "furnished" ? "Market this as furnished housing" : "Hold for Airbnb"}</p>
    <table style="width:100%;border-collapse:collapse;margin:18px 0"><tbody>
      <tr><td style="border:1px solid #ddd;padding:10px">Likely Airbnb</td><td style="border:1px solid #ddd;padding:10px"><strong>${money(alert.analysis.likelyShortTermRevenue)}</strong></td></tr>
      <tr><td style="border:1px solid #ddd;padding:10px">Comparable unfurnished rent</td><td style="border:1px solid #ddd;padding:10px"><strong>${money(alert.analysis.marketMonthlyRent)}/mo</strong></td></tr>
      <tr><td style="border:1px solid #ddd;padding:10px">Furnished offer</td><td style="border:1px solid #ddd;padding:10px"><strong>${money(alert.analysis.recommendedTotal)}</strong></td></tr>
    </tbody></table>
    <p>${alert.alertReason}</p>
    <ul>${alert.analysis.explanation.map((x: string) => `<li>${x}</li>`).join("")}</ul>
    <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://gapstay.vercel.app"}/dashboard" style="display:inline-block;background:#111;color:#fff;padding:12px 16px;border-radius:999px;text-decoration:none">Open GapStay</a></p>
    <p style="font-size:12px;color:#666">GapStay provides recommendations and analysis tools. We do not guarantee occupancy, bookings, rental income, or financial performance.</p>
  </div>`;
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
      cleaningFee: monitor.cleaning_fee,
      marketMonthlyRent: monitor.market_monthly_rent
    });
    const alert = evaluation.findings.find(f => f.shouldAlert);
    const newAlert = Boolean(alert && alert.alertHash !== monitor.last_alert_hash);
    let status = alert ? "needs_alert" : "checked";
    let emailStatus = "not_sent";

    if (alert && newAlert) {
      const email = await sendGapStayEmail({
        to: monitor.owner_email,
        subject: `GapStay: ${alert.gap.nights} unbooked nights need a decision`,
        html: alertEmailHtml(monitor, alert)
      });
      emailStatus = email.reason;
      status = email.ok ? "alert_sent" : "alert_email_failed";
    }

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

    results.push({ id: monitor.id, ok: evaluation.ok, findings: evaluation.findings.length, status, emailStatus, firstAlert: alert || null });
  }

  return NextResponse.json({ ok: true, checked: results.length, results });
}
