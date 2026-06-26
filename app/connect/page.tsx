"use client";
import { useState, FormEvent } from "react";

export default function ConnectPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/audit-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, platform })
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <main className="as-connect-page">
      <div className="as-wrap">
        {status === "done" ? (
          <div className="as-connect-card as-connect-success">
            <h1 className="as-h2">You&rsquo;re on the list.</h1>
            <p className="as-body">We&rsquo;ll review your account and send your waste report within 24 hours. Check your inbox at <strong>{email}</strong>.</p>
          </div>
        ) : (
          <div className="as-connect-card">
            <p className="as-label">Free waste audit</p>
            <h1 className="as-h2">Connect your ad account</h1>
            <p className="as-intro" style={{ marginBottom: 32 }}>
              Tell us where to look. We&rsquo;ll analyze 30 days of campaigns and send you a waste report — no credit card, no commitment.
            </p>
            <form className="as-connect-form" onSubmit={handleSubmit}>
              <label className="as-field">
                <span className="as-field-label">Your name</span>
                <input
                  className="as-input"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                />
              </label>
              <label className="as-field">
                <span className="as-field-label">Work email</span>
                <input
                  className="as-input"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                />
              </label>
              <label className="as-field">
                <span className="as-field-label">Ad platform</span>
                <select
                  className="as-input"
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                >
                  <option value="">Select platform…</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Both">Both Google &amp; Meta</option>
                </select>
              </label>
              {status === "error" && (
                <p className="as-connect-error">Something went wrong — please try again or email us directly.</p>
              )}
              <button
                className="as-btn-dark"
                type="submit"
                disabled={status === "loading"}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {status === "loading" ? "Sending…" : "Get my free waste report →"}
              </button>
              <p className="as-fine" style={{ textAlign: "center" }}>No credit card required · read-only access · we never modify your campaigns</p>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
