export async function sendGapStayEmail(input: { to?: string | null; subject: string; html: string }) {
  const to = input.to?.trim();
  const key = process.env.RESEND_API_KEY;
  if (!to) return { ok: false, reason: "missing recipient" };
  if (!key) return { ok: false, reason: "email service not configured" };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.GAPSTAY_FROM_EMAIL || "GapStay <support@gapstay.com>",
      to,
      subject: input.subject,
      html: input.html
    })
  });

  if (!response.ok) return { ok: false, reason: await response.text().catch(() => "email send failed") };
  return { ok: true, reason: "sent" };
}
