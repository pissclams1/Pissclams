import Stripe from "stripe";

export const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2024-12-18.acacia" })
  : null;

export const priceMap: Record<string, string | undefined> = {
  publish_gap: process.env.STRIPE_PRICE_PUBLISH_GAP,
  host_monthly: process.env.STRIPE_PRICE_HOST_MONTHLY,
  portfolio_monthly: process.env.STRIPE_PRICE_PORTFOLIO_MONTHLY
};

export function planMode(plan: string): "payment" | "subscription" {
  return plan === "publish_gap" ? "payment" : "subscription";
}

export function planAmount(plan: string) {
  if (plan === "publish_gap") return 1900;
  if (plan === "host_monthly") return 4900;
  if (plan === "portfolio_monthly") return 9900;
  return 0;
}
