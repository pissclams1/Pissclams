import Link from "next/link";

export default function HomePage() {
  return <main>
    <section className="wrap hero heroPrimary">
      <div>
        <p className="kicker">Overflow cleanup prep for bookkeepers</p>
        <h1 className="h1">Stop turning away messy cleanup work.</h1>
        <p className="lead">Cleanup Desk turns client chaos into a review-ready packet.</p>
        <p className="muted heroSupport">Upload transaction exports and notes. Cleanup Desk parses the mess, groups vendors, flags missing information, and produces the questions a professional reviewer needs to finish faster.</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:26}}>
          <Link className="darkpill" href="/intake">Create a cleanup job</Link>
          <Link className="pill" href="/packet-preview">See packet preview</Link>
        </div>
        <p className="muted" style={{fontSize:13,marginTop:18}}>Prep only. Not bookkeeping, tax advice, CPA work, or filings.</p>
      </div>
      <div className="thesisCard">
        <p className="kicker" style={{color:"rgba(251,247,239,.55)"}}>Sample cleanup packet</p>
        <div style={{display:"grid",gap:14,marginTop:20}}>
          <Decision label="GAPS" text="Missing months, incomplete statements, and stale documents." color="#ead27b" />
          <Decision label="FLAGS" text="Duplicate-looking transactions and client-question items." color="#e87b6a" />
          <Decision label="REVIEW" text="Suggested categories ready for human approval." color="#7ecfaa" />
        </div>
        <p style={{fontSize:13,color:"rgba(251,247,239,.45)",marginTop:20,paddingTop:20,borderTop:"1px solid rgba(255,255,255,.1)",lineHeight:1.6}}>The bookkeeper remains the professional. Cleanup Desk does the sorting, packet prep, and question generation.</p>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap section">
        <div className="sectionIntro">
          <p className="kicker">The core insight</p>
          <h2 className="big">Messy cleanup is profitable, but miserable.</h2>
          <p className="muted" style={{maxWidth:640,fontSize:18}}>Bookkeepers and small CPA firms often avoid cleanup work because the first pass is tedious. Cleanup Desk makes the first pass faster without pretending to replace professional judgment.</p>
        </div>
        <div className="grid grid3">
          <div className="feature"><span>1</span><h3>Upload the mess</h3><p className="muted">CSV exports, statements, notes, and client context go into one cleanup intake.</p></div>
          <div className="feature"><span>2</span><h3>Generate the packet</h3><p className="muted">The backend parses transactions, suggests categories, clusters vendors, and flags questions.</p></div>
          <div className="feature"><span>3</span><h3>Review faster</h3><p className="muted">The professional reviewer gets organized workpapers instead of a digital shoebox.</p></div>
        </div>
      </div>
    </section>

    <section className="sectionline">
      <div className="wrap section sampleBand">
        <div><p className="kicker">What you receive</p><h2 className="big">A cleanup prep packet, not another dashboard.</h2><p className="muted">Generated packets include transaction counts, vendor lists, category suggestions, risk flags, and client questions.</p><Link className="darkpill" href="/intake" style={{marginTop:18,display:"inline-flex"}}>Start intake</Link></div>
        <div className="miniOffer"><p className="kicker">Packet preview</p><h3>Client cleanup packet</h3><p className="muted" style={{fontSize:14,marginBottom:18}}>8 transactions parsed. 4 items need client questions. 5 vendors normalized. Tax-sensitive items marked for review.</p><div style={{background:"#fbf7ef",borderLeft:"3px solid var(--clay)",padding:"14px 16px",borderRadius:4,fontSize:13,lineHeight:1.7,color:"rgba(17,17,17,.7)"}}><strong>Questions for client</strong><br/>Confirm business purpose for Amazon Marketplace.<br/>Confirm category for Unknown Vendor 8821.</div><div className="result" style={{marginTop:14}}><Signal label="Transactions" value="8"/><Signal label="Review flags" value="4"/></div></div>
      </div>
    </section>

    <section className="wrap section">
      <div className="sectionIntro"><p className="kicker">Pricing</p><h2 className="big">Simple cleanup-prep pricing.</h2><p className="muted">Charge the client for professional cleanup. Use Cleanup Desk to remove the sorting pain before review.</p></div>
      <div className="grid grid3 pricingPreview" style={{maxWidth:860,margin:"0 auto"}}><Price name="Light prep" price="$299" cta="Start intake" href="/intake" /><Price name="Standard packet" price="$799" cta="Start intake" href="/intake" featured /><Price name="Heavy cleanup" price="$1,499+" cta="Start intake" href="/intake" /></div>
    </section>
  </main>;
}

function Decision({label,text,color}:{label:string;text:string;color:string}) { return <div style={{display:"grid",gridTemplateColumns:"18px 1fr",gap:12,alignItems:"start"}}><span style={{width:14,height:14,borderRadius:999,background:color,marginTop:4}}/><div><strong style={{color:"#fbf7ef"}}>{label}</strong><p style={{margin:"4px 0 0",fontSize:13,color:"rgba(251,247,239,.6)",lineHeight:1.5}}>{text}</p></div></div>; }
function Signal({label,value}:{label:string;value:string}) { return <div className="stat"><span>{label}</span><strong>{value}</strong></div>; }
function Price({name,price,cta,href,featured=false}:{name:string;price:string;cta:string;href:string;featured?:boolean}) { return <div className={`priceCard${featured?" featuredPrice":""}`}><p className="kicker">{name}</p><div className="price">{price}</div><Link className={featured?"darkpill":"pill"} href={href}>{cta}</Link></div>; }
