"use client";
import { useState } from "react";

export default function CheckoutButton({ plan, listingId, email, children, className = "darkpill" }: { plan: string; listingId?: string; email?: string; children: React.ReactNode; className?: string }) {
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    try {
      const response = await fetch("/api/start-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, listingId, email })
      });
      const data = await response.json().catch(() => ({}));
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      alert(data?.message || "Payment is not ready yet.");
    } finally {
      setLoading(false);
    }
  }

  return <button className={className} type="button" onClick={start} disabled={loading}>{loading ? "Opening checkout..." : children}</button>;
}
