import Link from "next/link";

const plans = [
  { name: "Free Analysis", price: "$0", text: "Analyze one calendar gap and compare likely nightly revenue with a furnished-stay offer.", cta: "Analyze a gap", href: "/host", featured: false },
  { name: "Publish One Offer", price: "$19", text: "Publish one shareable furnished-stay offer for 30 days with inquiry capture and posting guidance.", cta: "Analyze a gap", href: "/host", featured: false },
  { name: "Calendar Watch", price: "$49/month", text: "Get ongoing gap detection, a fresh revenue comparison for every opening, and a ready-to-publish furnished offer for one property.", cta: "Analyze my property", href: "/host", featured: true },
  { name: "Portfolio Watch", price: "$99/month", text: "Monitor up to three properties and prioritize the calendar gaps with the most revenue at risk.", cta: "Analyze my portfolio", href: "/host", featured: false }
];

export default function PricingPage(){
  return <main className="wrap section topspace">
    <p className="kicker">Pricing</p>
    <h1 className="big">Start with the gap. Pay when you want to act on it.</h1>
    <p className="lead" style={{fontSize:18}}>Every plan starts with the same question: which use of the entire open window produces the most revenue?</p>
    <div className="grid grid4 pricingGrid">{plans.map(plan=><div className={`priceCard${plan.featured?" featuredPrice":""}`} key={plan.name}><p className="kicker">{plan.name}</p><div className="price">{plan.price}</div><p className="muted">{plan.text}</p><Link className={plan.featured?"darkpill":"pill"} href={plan.href}>{plan.cta}</Link></div>)}</div>
    <p className="successBox" style={{maxWidth:760,margin:"18px auto 0",textAlign:"center"}}>Most hosts start with one analysis. Calendar Watch is for hosts who never want to miss another gap.</p>
  </main>;
}
