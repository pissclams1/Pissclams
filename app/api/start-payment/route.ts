import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, mode: "manual_beta", message: "Automated checkout is disabled during the manual beta. Use manual review and a direct payment link." },
    { status: 410 }
  );
}
