import Link from "next/link";

export default function AuthPage(){
  return <main className="wrap section topspace">
    <div className="card pad">
      <p className="kicker">Host accounts</p>
      <h1 className="big">Accounts come after the manual beta proves demand.</h1>
      <p className="muted">GapStay currently runs as a lightweight manual MVP. Hosts can check dates, preview a page, and request manual publishing without account setup.</p>
      <p className="muted">Persistent accounts, saved properties, and automated payment-gated publishing should be added only after the first paid manual users.</p>
      <div className="actions">
        <Link className="darkpill" href="/host">Check my empty dates</Link>
        <Link className="pill" href="/pricing">View pricing</Link>
      </div>
    </div>
  </main>
}
