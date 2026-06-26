import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, platform } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, error: "Email not configured" }, { status: 500 });
  }

  const notifyEmail = process.env.ADSTAKE_NOTIFY_EMAIL || "andreas11735@gmail.com";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ADSTAKE_FROM_EMAIL || "AdStake <hello@useadstake.com>",
      to: notifyEmail,
      subject: `New audit request — ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Platform:</strong> ${platform || "Not specified"}</p>`
    })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "send failed");
    return NextResponse.json({ ok: false, error: text }, { status: 500 });
  }

  // Send confirmation to user
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ADSTAKE_FROM_EMAIL || "AdStake <hello@useadstake.com>",
      to: email,
      subject: "Your AdStake audit request — we'll be in touch",
      html: `<p>Hi ${name},</p>
<p>Thanks for requesting a free waste audit. We'll review your ${platform || "ad"} account details and be in touch within 24 hours.</p>
<p>— The AdStake team</p>`
    })
  });

  return NextResponse.json({ ok: true });
}
