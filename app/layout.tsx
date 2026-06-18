import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GapStay — Calendar Watch for under-booked Airbnbs",
  description: "GapStay watches empty Airbnb and VRBO calendar gaps, recommends the next revenue move, and creates furnished-stay marketing pages."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <div className="wrap" style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
            <Link href="/" className="brand">GapStay</Link>
            <nav className="navlinks">
              <Link href="/#how">How it works</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/host" className="pill">Analyze</Link>
            </nav>
            <Link href="/host" className="pill mobileOnly">Analyze</Link>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="wrap" style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
            <span>GapStay — calendar watch, revenue guidance, and furnished-stay pages.</span>
            <span>Watch the gap. Make the call. Post the offer.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
