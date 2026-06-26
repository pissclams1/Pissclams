import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="as-hero">
        <div className="as-wrap">
          <h1 className="as-h1 as-fadein">We find the money your search ads are wasting.</h1>
          <p className="as-hero-sub as-fadein as-delay1">
            Free audit in 60 seconds. No credit card. If we find savings, we take 20% — you keep the rest.
          </p>
          <div className="as-hero-actions as-fadein as-delay2">
            <Link href="/connect" className="as-btn-dark">Get your free waste report</Link>
            <Link href="#how" className="as-btn-ghost">See how it works ↓</Link>
          </div>
          <div className="as-stats as-fadein as-delay3">
            <div className="as-stat">
              <span className="as-stat-fig">30%</span>
              <span className="as-stat-label">Average SMB ad spend wasted monthly</span>
            </div>
            <div className="as-stat">
              <span className="as-stat-fig">50%+</span>
              <span className="as-stat-label">SMB accounts with no conversion tracking</span>
            </div>
            <div className="as-stat as-stat-last">
              <span className="as-stat-fig as-stat-green as-serif-italic">$0</span>
              <span className="as-stat-label">Your agency earns telling you to pause a campaign</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="as-section as-section-warm" id="how">
        <div className="as-wrap">
          <p className="as-label">How it works</p>
          <h2 className="as-h2">Built against the conflict</h2>
          <p className="as-intro">Traditional agencies earn more when you spend more — so finding your waste costs them money. AdStake is built the other way around.</p>
          <div className="as-steps">
            <div className="as-step">
              <p className="as-step-num">Step 01</p>
              <h3 className="as-h3">Free waste audit</h3>
              <p className="as-body">Connect your Google or Meta Ads account in 60 seconds. We pull 30 days of campaign data and identify your top 3 waste signals — by campaign name, dollar amount, and root cause.</p>
            </div>
            <div className="as-step">
              <p className="as-step-num">Step 02</p>
              <h3 className="as-h3">Savings baseline</h3>
              <p className="as-body">Month 1 establishes your baseline: cost per conversion, spend by campaign, waste percentage. Every month after, we show you the documented improvement.</p>
            </div>
            <div className="as-step">
              <p className="as-step-num">Step 03</p>
              <h3 className="as-h3">Aligned pricing</h3>
              <p className="as-body">$49/month flat. Plus 20% of documented savings — only if savings exist. Find $500 in waste, you keep $400. Find nothing, you owe nothing extra. Your savings are the only thing we optimize for.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Incentive Problem */}
      <section className="as-section as-section-white">
        <div className="as-wrap">
          <p className="as-label">The incentive problem</p>
          <h2 className="as-h2">Why every other tool leaves your waste alone</h2>
          <p className="as-intro">When an agency charges 15% of ad spend, cutting your waste by $500/month costs them $75. So they don't cut it. The same is true for AI tools that price to your budget size — their incentive is to keep you spending more. AdStake only earns when you save. Your waste is the only problem we're paid to solve.</p>
          <div className="as-compare-grid">
            {/* Traditional Agency card */}
            <div className="as-card as-card-red">
              <div className="as-card-header">
                <span className="as-card-label as-label-red">Traditional Agency</span>
                <span className="as-card-sublabel as-sublabel-red">15% of ad spend</span>
              </div>
              <div className="as-inner-box">
                <p className="as-micro-label">You spend</p>
                <p className="as-inner-amount">$3,000</p>
                <p className="as-inner-note as-note-red">They earn $450</p>
              </div>
              <div className="as-inner-box">
                <p className="as-micro-label">You cut $900 in waste</p>
                <p className="as-inner-loss">They lose $135 — so they won't find it</p>
              </div>
            </div>
            {/* AdStake card */}
            <div className="as-card as-card-green">
              <div className="as-card-header">
                <span className="as-card-label as-label-green">AdStake</span>
                <span className="as-card-sublabel as-sublabel-green">$49/month flat</span>
              </div>
              <div className="as-inner-box">
                <p className="as-micro-label">You pay</p>
                <p className="as-inner-amount">$49/month</p>
              </div>
              <div className="as-inner-box">
                <p className="as-micro-label">$900 in waste found</p>
                <div className="as-bar-wrap">
                  <div className="as-bar">
                    <div className="as-bar-green" />
                    <div className="as-bar-gray" />
                  </div>
                  <div className="as-bar-labels">
                    <div>
                      <span className="as-bar-amount-green">$720</span>
                      <span className="as-bar-sub-green">You keep — 80%</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="as-bar-amount-gray">$180</span>
                      <span className="as-bar-sub-gray">We take — 20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waste Definition */}
      <section className="as-section-waste">
        <div className="as-wrap">
          <div className="as-waste-block">
            <p className="as-label">How we define waste</p>
            <p className="as-waste-body">We define waste as spend that produces zero recorded conversions, plus objective account errors — duplicate bidding, broken tracking, mismatched targeting. <strong>We don't guess. We measure.</strong></p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="as-section as-section-white" id="pricing">
        <div className="as-wrap">
          <p className="as-label">Pricing</p>
          <h2 className="as-h2">One plan. Fully aligned.</h2>
          <p className="as-intro">The flat fee covers the work. Everything beyond it comes out of savings you've already banked.</p>
          <div className="as-pricing-card">
            <div className="as-kicker-strip">
              <div className="as-kicker-left">
                <p className="as-kicker-headline">You keep 80¢ of every dollar saved</p>
                <p className="as-kicker-sub">The other 20¢ is our only share of your savings</p>
              </div>
              <div className="as-mini-bar">
                <div className="as-mini-bar-green" />
                <div className="as-mini-bar-gray" />
              </div>
            </div>
            <div className="as-card-body">
              <p className="as-plan-name">Starter · one account</p>
              <div className="as-price-row">
                <span className="as-price">$49</span>
                <span className="as-per-month">/per month</span>
              </div>
              <p className="as-sub-price">plus 20% of documented savings — only when savings exist</p>
              <p className="as-green-note">Find nothing, pay nothing extra.</p>
              <hr className="as-divider" />
              <ul className="as-features">
                <li><span className="as-check">✓</span> Free waste audit every month</li>
                <li><span className="as-check">✓</span> Top 3 waste signals by campaign</li>
                <li><span className="as-check">✓</span> Savings baseline and monthly tracking</li>
                <li><span className="as-check">✓</span> <strong>You keep 80¢ of every dollar saved</strong></li>
                <li><span className="as-check">✓</span> Google Ads + Meta Ads integration</li>
                <li><span className="as-check">✓</span> Email report delivery</li>
              </ul>
              <Link href="/connect" className="as-btn-dark as-btn-full">Start free audit →</Link>
              <p className="as-fine">No credit card for the first audit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="as-section as-section-warm">
        <div className="as-wrap">
          <h2 className="as-h2">Here&rsquo;s exactly what to expect.</h2>
          <div className="as-timeline">
            <TimelineNode
              label="Day 1"
              active
              title="You connect your account"
              body="Connect your Google Ads or Meta Ads account via read-only OAuth. Takes under 60 seconds. We immediately run your first audit and email you the results."
            />
            <TimelineNode
              label="Days 1–30"
              title="Baseline is established"
              body="Your baseline is established. We analyze 30 days of campaign data — spend, conversions, cost per conversion, tracking quality. This becomes your fixed reference point. Nothing is charged beyond the $49 monthly fee during this period."
            />
            <TimelineNode
              label="Day 31 onward"
              title="Monthly monitoring begins"
              body="Every 30 days we run a new audit, compare it against your baseline, and email you a report. If we find savings, your report shows exactly what changed, why it counts as savings, and what the performance fee calculation is. You review it before anything is invoiced."
            />
            <TimelineNode
              label="On savings months"
              active
              last
              title="Savings are documented and billed transparently"
              body="If we've found documented savings, you'll receive an itemized invoice showing the exact breakdown — 20% to us, 80% stays in your account. You can dispute any line item before paying. Disputed items are excluded, no questions asked."
            />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="as-section as-section-white">
        <div className="as-wrap">
          <div className="as-trust-card">
            <div className="as-trust-left">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="13" width="18" height="13" rx="2" stroke="#16a34a" strokeWidth="1.5"/>
                <path d="M10 13V9a5 5 0 0 1 10 0v4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="15" cy="20" r="2" fill="#16a34a"/>
              </svg>
              <h2 className="as-trust-h2">Built so you never have to take our word for it</h2>
              <p className="as-trust-sub">Every protection below is structural — not a policy we could quietly change.</p>
            </div>
            <div className="as-trust-right">
              <TrustBullet text="Read-only access to ad accounts — we cannot edit campaigns, change budgets, or launch ads." />
              <TrustBullet text="Baseline methodology is fixed after Month 1 — no moving goalposts." />
              <TrustBullet text="All savings calculations are visible and traceable in your dashboard." />
              <TrustBullet text="Dispute any line item — it's excluded at no charge, no questions asked." />
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="as-footer-cta">
        <div className="as-wrap" style={{ textAlign: "center" }}>
          <h2 className="as-footer-cta-h2">Start with a free waste report</h2>
          <p className="as-footer-cta-body">Connect your Google or Meta Ads account. We analyze 30 days of campaigns and show you exactly where money is leaking — before you pay anything.</p>
          <Link href="/connect" className="as-btn-white">Get your free waste report →</Link>
          <p className="as-footer-cta-fine">No credit card required · read-only access · we cannot modify your campaigns</p>
        </div>
      </section>
    </main>
  );
}

function TimelineNode({
  label, active, last, title, body
}: {
  label: string;
  active?: boolean;
  last?: boolean;
  title: string;
  body: string;
}) {
  return (
    <div className={`as-tl-node${last ? " as-tl-last" : ""}`}>
      <div className="as-tl-left">
        <div className={`as-tl-dot${active ? " as-tl-dot-active" : ""}`} />
        {!last && <div className="as-tl-line" />}
      </div>
      <div className="as-tl-content">
        <p className={`as-tl-label${active ? " as-tl-label-active" : ""}`}>{label}</p>
        <h3 className="as-h3" style={{ marginBottom: 6 }}>{title}</h3>
        <p className="as-body">{body}</p>
      </div>
    </div>
  );
}

function TrustBullet({ text }: { text: string }) {
  return (
    <div className="as-trust-bullet">
      <span className="as-trust-check">✓</span>
      <p className="as-trust-body">{text}</p>
    </div>
  );
}
