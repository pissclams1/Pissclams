import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "GapStay — Find the revenue in your booking gaps",
  description: "GapStay helps Airbnb and VRBO hosts maximize revenue from the gaps between bookings."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <header className="nav">
          <div className="wrap" style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
            <Link href="/" className="brand">GapStay</Link>
            <nav className="navlinks">
              <Link href="/#how">How it works</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/auth">Sign in</Link>
              <Link href="/host" className="pill">Import listing</Link>
            </nav>
            <nav className="mobileNav mobileOnly" aria-label="Mobile navigation">
              <Link href="/#how">How</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/host" className="pill">Import</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="wrap footerGrid">
            <div><Link href="/" className="brand">GapStay</Link><p>Helps Airbnb and VRBO hosts earn more revenue from the gaps between bookings.</p></div>
            <div><strong>Product</strong><Link href="/#how">How it works</Link><Link href="/pricing">Pricing</Link><Link href="/dashboard">Dashboard</Link><Link href="/host">Analyze a gap</Link></div>
            <div><strong>Legal</strong><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link></div>
            <div><strong>Contact</strong><a href="mailto:support@gapstay.com">support@gapstay.com</a></div>
          </div>
          <div className="wrap footerBottom">© 2026 GapStay</div>
        </footer>
      </body>
    </html>
  );
}
