import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    appUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    stripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
    stripeWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    stripePublishGapPrice: Boolean(process.env.STRIPE_PRICE_PUBLISH_GAP),
    stripeHostMonthlyPrice: Boolean(process.env.STRIPE_PRICE_HOST_MONTHLY),
    stripePortfolioMonthlyPrice: Boolean(process.env.STRIPE_PRICE_PORTFOLIO_MONTHLY)
  };
  const requiredForLive = ["supabaseUrl", "supabaseAnonKey", "stripeSecretKey", "stripeWebhookSecret", "stripePublishGapPrice", "stripeHostMonthlyPrice"] as const;
  const missing = requiredForLive.filter(key => !checks[key]);
  return NextResponse.json({ ok: missing.length === 0, checks, missing });
}
