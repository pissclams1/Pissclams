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
          <div className="wrap" style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
            <span>GapStay — more revenue from the gaps between bookings.</span>
            <span>The whole gap is the number that matters.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
