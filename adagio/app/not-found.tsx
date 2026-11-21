import Link from "next/link";

export default function NotFound() {
  return (
    <main className="center">
      <p>That page wandered off.</p>
      <Link href="/" className="link">Back to Adagio</Link>
    </main>
  );
}
