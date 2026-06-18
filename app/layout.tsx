import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GapStay — Find the listing inside your calendar gap",
  description: "Turn vacant Airbnb and VRBO calendar gaps into furnished monthly-stay offers."
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
              <Link href="/host" className="pill">Find my gaps</Link>
            </nav>
            <Link href="/host" className="pill mobileOnly">Find gaps</Link>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="wrap" style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
            <span>GapStay — the gap between your bookings is a listing you have not made.</span>
            <span>Find the gap. Price the stay. Publish the page.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
