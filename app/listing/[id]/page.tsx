"use client";
import { FormEvent, use, useEffect, useState } from "react";
import Link from "next/link";
import { money, prettyDate } from "../../../lib/pricing";
import { getListingRemote, saveInquiryRemote, sampleListing, type Listing } from "../../../lib/store";

export default function ListingPage({params}:{params:Promise<{id:string}>}){
  const { id } = use(params);
  const [listing,setListing]=useState<Listing|null>(id === "sample" ? sampleListing : null);
  const [loading,setLoading]=useState(id !== "sample");
  const [sent,setSent]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{if(id === "sample") return; let alive=true; async function load(){setLoading(true); const found=await getListingRemote(id); if(alive){setListing(found); setLoading(false);}} void load(); return()=>{alive=false}},[id]);
  if(loading) return <main className="wrap section topspace"><div className="card pad"><p className="muted">Loading offer...</p></div></main>;
  if(!listing) return <main className="wrap section topspace"><div className="card pad"><p className="kicker">Offer not found</p><h1 className="big">This furnished-stay offer is not public yet.</h1><p className="muted">The host can preview it from the browser where it was created or publish it after payment.</p><div className="actions"><Link className="darkpill" href="/host">Analyze a gap</Link><Link className="pill" href="/listing/sample">See sample listing</Link></div></div></main>;
  const analysis=listing.analysis;
  const facebookCopy = `Furnished stay available in ${listing.city}, ${listing.state} from ${prettyDate(analysis.startDate)} to ${prettyDate(analysis.endDate)}. ${listing.bedrooms} bedroom / ${listing.bathrooms} bathroom ${listing.propertyType}, fully furnished. ${money(analysis.monthlyEquivalent)}/month or ${money(analysis.recommendedTotal)} all-in for the full stay. Best for relocation, a travel nurse, insurance displacement, or someone between homes. Send an inquiry through this GapStay listing.`;
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setError("");const form=event.currentTarget;const data=new FormData(form);try{await saveInquiryRemote({id:`inq-${Date.now().toString(36)}`,listingId:listing.id,name:String(data.get("name")||""),email:String(data.get("email")||""),phone:String(data.get("phone")||""),reason:String(data.get("reason")||""),message:`Dates: ${String(data.get("dates")||"")}. Occupants: ${String(data.get("occupants")||"")}. Pets: ${String(data.get("pets")||"")}. Message: ${String(data.get("message")||"")}`,createdAt:new Date().toISOString()});setSent(true);form.reset()}catch(error){setError(error instanceof Error?error.message:"Could not send inquiry.")}}
  return <main className="listingPage">
    <section className="listingHero">
      {listing.imageUrl?<img src={listing.imageUrl} alt={listing.title}/>:<div className="listingImagePlaceholder"/>}
      <div className="wrap listingHeroContent"><p className="availabilityLabel">Furnished Stay Available</p><h1>{listing.title}</h1><p>{listing.city}, {listing.state} · {listing.propertyType}</p></div>
    </section>
    <div className="wrap section listingLayout">
      <section>
        <div className="offerFacts">
          <Fact label="Dates" value={`${prettyDate(analysis.startDate)} – ${prettyDate(analysis.endDate)}`}/>
          <Fact label="Bedrooms" value={String(listing.bedrooms)}/>
          <Fact label="Bathrooms" value={String(listing.bathrooms)}/>
          <Fact label="Monthly price" value={money(analysis.monthlyEquivalent)}/>
          <Fact label="All-in price" value={money(analysis.recommendedTotal)}/>
        </div>
        <div className="listingCopy"><p>{listing.description}</p><h2>Best for</h2><ul className="bestFor"><li>Relocation</li><li>Travel nurse</li><li>Insurance displacement</li><li>Between homes</li></ul></div>
        <div className="listingSection"><h2>What&apos;s included</h2><div className="amenityGrid">{listing.amenities.map(item=><span key={item}>{item}</span>)}</div></div>
        <div className="listingSection"><p className="kicker">Copy for Facebook Marketplace</p><h2>Post-ready copy</h2><div className="copyBox"><p>{facebookCopy}</p></div></div>
        <div className="listingSection"><p className="kicker">Where to post</p><h2>Put this offer where furnished renters already look.</h2><ul className="list"><li>Facebook Marketplace housing and rentals</li><li>Local housing, relocation, and sublet groups</li><li>Travel nurse and hospital housing groups</li><li>Local realtors and people between homes</li><li>Employer and insurance-displacement contacts</li></ul></div>
      </section>
      <aside className="inquiryCard"><p className="kicker">Request this stay</p><div className="price">{money(analysis.recommendedTotal)}</div><p className="muted">All-in for {analysis.nights} nights · {money(analysis.monthlyEquivalent)}/month</p>{sent?<div className="successBox"><strong>Inquiry sent</strong><p>The host can now see your request in their dashboard.</p></div>:id==="sample"||listing.publishStatus!=="published"?<div className="sampleNotice"><p>{id==="sample"?"This is a sample offer. Analyze your property to create a live inquiry page.":"This is your private preview. Publish the offer to accept renter inquiries."}</p><Link className="darkpill" href={id==="sample"?"/host":"/dashboard"}>{id==="sample"?"Analyze a gap":"Open dashboard"}</Link></div>:<form onSubmit={submit} className="grid"><Field name="name" label="Name"/><Field name="email" label="Email" type="email"/><Field name="phone" label="Phone"/><label><span className="label">Best fit</span><select className="input" name="reason"><option>Relocation</option><option>Travel nurse</option><option>Insurance displacement</option><option>Between homes</option></select></label><Field name="dates" label="Desired dates"/><div className="grid grid2"><Field name="occupants" label="Occupants"/><Field name="pets" label="Pets"/></div><label><span className="label">Message</span><textarea className="input textarea" name="message" placeholder="Tell the host what you need."/></label>{error?<div className="errorBox">{error}</div>:null}<button className="darkpill" type="submit">Send inquiry</button></form>}</aside>
    </div>
  </main>;
}
function Fact({label,value}:{label:string;value:string}){return <div><span>{label}</span><strong>{value}</strong></div>}
function Field({label,name,type="text"}:{label:string;name:string;type?:string}){return <label><span className="label">{label}</span><input className="input" name={name} type={type} required/></label>}
