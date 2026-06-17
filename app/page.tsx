import Link from "next/link";

export default function HomePage() {
  return <main className="wrap section topspace">
    <div className="card pad">
      <p className="kicker">GapStay</p>
      <h1 className="h1">Fill the empty month.</h1>
      <p className="lead">Create a professional page for unused calendar dates and collect direct renter inquiries.</p>
      <div className="actions">
        <Link className="darkpill" href="/host">Check my empty dates</Link>
        <Link className="pill" href="/listing/sample">See an example</Link>
      </div>
    </div>
  </main>;
}
