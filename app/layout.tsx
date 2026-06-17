import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GapStay — Fill the empty month",
  description: "Turn vacant Airbnb and VRBO calendar gaps into shareable furnished-stay offers."
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
              <Link href="/auth" className="pill">Host access</Link>
            </nav>
            <Link href="/host" className="pill mobileOnly">Analyze</Link>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="wrap" style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
            <span>GapStay — turn empty Airbnb calendar gaps into furnished-stay offers.</span>
            <span>Analyze. Publish. Capture inquiries. Fill the gap.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
