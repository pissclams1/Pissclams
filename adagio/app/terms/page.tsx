import Link from "next/link";

export const metadata = { title: "Terms: Adagio" };

export default function Terms() {
  return (
    <main className="doc">
      <Link href="/" className="link">Back to Adagio</Link>
      <h1>Terms</h1>
      <p className="muted">Last updated 21 November 2026. This is a prototype. These terms are written in plain language and have not had a legal review.</p>

      <h2>What Adagio is</h2>
      <p>Adagio is a gallery of AI-made art. Anyone can look. There are no accounts, and viewers are only identified by an anonymous ID stored on their device.</p>

      <h2>If you share your work</h2>
      <p>By submitting work to Adagio, you confirm that:</p>
      <ul>
        <li>you own the rights to the work, or you have permission from whoever does, to let us show it;</li>
        <li>the work was made with AI tools, and your use of it does not break those tools&apos; terms; and</li>
        <li>the work does not copy someone else&apos;s art, and does not include anything you are not allowed to publish.</li>
      </ul>

      <h2>The license you give us</h2>
      <p>You keep ownership of your work. You give Adagio a non-exclusive, worldwide, royalty-free license to host, resize, display and share your work, with your name and any links you provide, on Adagio and in link previews of Adagio pages. You can ask us to remove your work at any time, and we will stop showing it. Copies that other people have already shared as links may take a short while to disappear from previews.</p>

      <h2>Money</h2>
      <p>Adagio does not run ads or pay creators today. If we earn ad revenue in the future, we may share part of it with creators. That is not a promise or a guarantee of any amount, and any payment would be set out in a separate agreement with you.</p>

      <h2>Engagement data</h2>
      <p>We count how people interact with the work on Adagio, such as views, loves and saves. We may share this engagement data with brands, in aggregated form for a work or a set of works. It does not include any viewer&apos;s anonymous ID.</p>

      <h2>Viewers</h2>
      <p>We store an anonymous ID so we can improve the feed. We do not ask for your name or email to look at art.</p>

      <h2>Changes</h2>
      <p>We may update these terms. The date at the top shows the latest version.</p>
    </main>
  );
}
