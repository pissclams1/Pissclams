import Link from "next/link";

const notThis = [
  "Not an Uncat or Debits replacement",
  "Not a live QBO/Xero transaction inbox",
  "Not final bookkeeping or filing work",
  "Not another portal for books that are already connected",
];

const outputs = [
  ["Completeness map", "Which account files are present, which months are missing, and what should be requested before review starts."],
  ["Staged rows", "Raw exports normalized into reviewer-friendly rows before anything is imported into QuickBooks or Xero."],
  ["Question pack", "A concise list of client questions for unclear vendors, transfers, duplicate-looking rows, and missing support."],
  ["Scope estimate", "A first-pass estimate of cleanup complexity so the firm can quote, staff, and sequence the job."],
];

export default function HomePage() {
  return <main>
    <section className="wrap hero heroPrimary">
      <div>
        <p className="kicker">Pre-ledger cleanup prep for catch-up bookkeeping firms</p>
        <h1 className="h1">Triage the mess before it hits QuickBooks.</h1>
        <p className="lead">Cleanup Desk turns raw exports, statements, notes, and document chaos into a structured cleanup packet your reviewers can use before they open a ledger.</p>
        <p className="muted heroSupport">Built for firms that sell QuickBooks cleanup, catch-up bookkeeping, and onboarding rescue. It sits before QBO/Xero — where the ugliest work starts.</p>
        <div className="actions"><Link className="darkpill" href="/intake">Create prep packet</Link><Link className="pill" href="/packet-preview">View packet preview</Link></div>
        <p className="muted" style={{fontSize:13,marginTop:18}}>Prep layer only. Qualified professionals make all final accounting decisions.</p>
      </div>
      <div className="thesisCard">
        <p className="kicker" style={{color:"rgba(251,247,239,.55)"}}>The wedge</p>
        <strong>Before Uncat. Before Debits. Before the ledger.</strong>
        <p style={{fontSize:17,lineHeight:1.6,marginTop:20}}>Those tools help once transactions already live inside QBO/Xero. Cleanup Desk handles the earlier stage: unsupported files, missing months, mixed accounts, client notes, and import prep.</p>
        <div style={{marginTop:28,paddingTop:22,borderTop:"1px solid rgba(255,255,255,.12)",display:"grid",gap:12}}>
          <Decision label="INPUT" text="Exports, PDFs, statements, receipts, notes, and prior records." color="#ead27b" />
          <Decision label="PREP" text="Normalize, detect gaps, stage rows, generate reviewer questions." color="#e87b6a" />
          <Decision label="OUTPUT" text="Cleanup packet for professional review and client follow-up." color="#7ecfaa" />
        </div>
      </div>
    </section>

    <section className="sectionline" id="how"><div className="wrap section"><div className="sectionIntro"><p className="kicker">Correct customer</p><h2 className="big">For firms that do cleanup all month, not solo bookkeepers who see one mess per quarter.</h2><p className="muted" style={{maxWidth:760,fontSize:18}}>The buyer is a catch-up bookkeeping or QuickBooks cleanup firm already billing for messy onboarding work. Cleanup Desk reduces prep drag, not professional judgment.</p></div><div className="grid grid3"><div className="feature"><span>1</span><h3>Collect the raw mess</h3><p className="muted">Client exports, statements, notes, receipts, and prior records arrive before the cleanup file is usable.</p></div><div className="feature"><span>2</span><h3>Build the prep packet</h3><p className="muted">The system stages rows, flags missing months, detects duplicate-looking items, groups vendors, and drafts client questions.</p></div><div className="feature"><span>3</span><h3>Reviewer finishes inside the firm</h3><p className="muted">Your staff imports, reconciles, corrects, and decides. Cleanup Desk only makes the first pass less miserable.</p></div></div></div></section>

    <section className="wrap section"><div className="sectionIntro"><p className="kicker">What it is not</p><h2 className="big">The boundary is the product.</h2><p className="muted">If the books are already live and the only problem is transaction follow-up, use a connected workflow tool. Cleanup Desk is for the pre-ledger intake swamp.</p></div><div className="grid grid4">{notThis.map((item) => <div className="metric" key={item}><b style={{fontSize:20}}>No</b><p className="muted">{item}</p></div>)}</div></section>

    <section className="sectionline"><div className="wrap section sampleBand"><div><p className="kicker">Deliverable</p><h2 className="big">A cleanup intake packet your team can review, quote, and act on.</h2><p className="muted">The output is a workpaper-style packet: data inventory, missing documents, transaction staging, vendor normalization, likely issues, and client questions.</p><Link className="darkpill" href="/packet-preview" style={{marginTop:18,display:"inline-flex"}}>See packet preview</Link></div><div className="miniOffer"><p className="kicker">Sample output</p><h3>Pre-ledger triage packet</h3><div className="result"><Signal label="Files received" value="7"/><Signal label="Missing months" value="3"/><Signal label="Staged rows" value="842"/><Signal label="Client questions" value="29"/></div><div style={{background:"#fbf7ef",borderLeft:"3px solid var(--clay)",padding:"14px 16px",borderRadius:4,fontSize:13,lineHeight:1.7,color:"rgba(17,17,17,.7)",marginTop:16}}><strong>Reviewer note</strong><br/>Do not import until March statement, payout detail, and transfer explanations are received.</div></div></div></section>

    <section className="wrap section"><div className="sectionIntro"><p className="kicker">Pricing</p><h2 className="big">Priced for cleanup firms, not casual users.</h2><p className="muted">The firm bills the cleanup engagement. Cleanup Desk is the prep desk that keeps staff out of the digital shoebox.</p></div><div className="grid grid3 pricingPreview" style={{maxWidth:920,margin:"0 auto"}}><Price name="Starter packet" price="$99/job" cta="Start intake" href="/intake" /><Price name="Standard prep" price="$299/job" cta="Start intake" href="/intake" featured /><Price name="Volume desk" price="$999+/mo" cta="Start intake" href="/intake" /></div></section>

    <section className="sectionline"><div className="wrap section"><div className="sectionIntro"><p className="kicker">Outputs</p><h2 className="big">What the reviewer receives.</h2></div><div className="grid grid4">{outputs.map(([title,body]) => <div className="feature" key={title}><h3>{title}</h3><p className="muted">{body}</p></div>)}</div></div></section>
  </main>;
}

function Decision({label,text,color}:{label:string;text:string;color:string}) { return <div style={{display:"grid",gridTemplateColumns:"18px 1fr",gap:12,alignItems:"start"}}><span style={{width:14,height:14,borderRadius:999,background:color,marginTop:4}}/><div><strong style={{color:"#fbf7ef",fontSize:14}}>{label}</strong><p style={{margin:"4px 0 0",fontSize:13,color:"rgba(251,247,239,.6)",lineHeight:1.5}}>{text}</p></div></div>; }
function Signal({label,value}:{label:string;value:string}) { return <div className="stat"><span>{label}</span><strong>{value}</strong></div>; }
function Price({name,price,cta,href,featured=false}:{name:string;price:string;cta:string;href:string;featured?:boolean}) { return <div className={`priceCard${featured?" featuredPrice":""}`}><p className="kicker">{name}</p><div className="price">{price}</div><Link className={featured?"darkpill":"pill"} href={href}>{cta}</Link></div>; }
