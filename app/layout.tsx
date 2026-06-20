import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cleanup Desk — Pre-ledger cleanup prep",
  description: "Cleanup Desk turns raw client records into review-ready cleanup packets for catch-up bookkeeping firms before QBO or Xero setup."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <header className="nav">
          <div className="wrap" style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
            <Link href="/" className="brand">Cleanup Desk</Link>
            <nav className="navlinks">
              <Link href="/#how">How it works</Link>
              <Link href="/packet-preview">Packet</Link>
              <Link href="/cleanup-admin">Admin</Link>
              <Link href="/intake" className="pill">Start intake</Link>
            </nav>
            <nav className="mobileNav mobileOnly" aria-label="Mobile navigation">
              <Link href="/#how">How</Link>
              <Link href="/packet-preview">Packet</Link>
              <Link href="/intake" className="pill">Intake</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="wrap footerGrid">
            <div><Link href="/" className="brand">Cleanup Desk</Link><p>Pre-ledger cleanup prep for catch-up bookkeeping and QuickBooks cleanup firms.</p></div>
            <div><strong>Product</strong><Link href="/#how">How it works</Link><Link href="/packet-preview">Packet preview</Link><Link href="/intake">Start intake</Link><Link href="/cleanup-admin">Admin</Link></div>
            <div><strong>Boundary</strong><Link href="/cleanup-boundary">Professional boundary</Link><Link href="/reviewer">Reviewer role</Link></div>
            <div><strong>Contact</strong><a href="mailto:support@cleanupdesk.com">support@cleanupdesk.com</a></div>
          </div>
          <div className="wrap footerBottom">© 2026 Cleanup Desk</div>
        </footer>
      </body>
    </html>
  );
}
