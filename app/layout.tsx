import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdStake — Find and keep the money your ads are wasting",
  description: "AdStake finds wasted spend in your Google and Meta ad accounts. Free audit in 60 seconds — you keep 80% of every dollar saved."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="as-nav">
          <div className="as-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Link href="/" className="as-brand">AdStake</Link>
            <nav className="as-navlinks">
              <Link href="#how">How it works</Link>
              <Link href="#pricing">Pricing</Link>
              <a href="mailto:hello@useadstake.com">Contact</a>
              <Link href="/connect" className="as-navcta">Get free audit</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="as-footer">
          <div className="as-wrap as-footer-inner">
            <div>
              <span className="as-footer-brand">AdStake</span>
              <p className="as-footer-tagline">We find the money your search ads are wasting.</p>
            </div>
            <nav className="as-footer-nav">
              <Link href="#how">How it works</Link>
              <Link href="#pricing">Pricing</Link>
              <Link href="/sample">Sample report</Link>
              <Link href="#">Contact</Link>
            </nav>
            <div className="as-footer-legal">
              <p>No conflict. No retainer. No BS.</p>
              <p>© 2026 AdStake. Read-only access only. We never modify your campaigns.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
