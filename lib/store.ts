import type { GapAnalysis } from "./pricing";
export type Listing = {
  id: string; title: string; city: string; state: string; propertyType: string; bedrooms: number; bathrooms: number; hostName: string; description: string; amenities: string[]; rules: string[]; analysis: GapAnalysis; sourceUrl?: string; imageUrl?: string; rating?: string; reviews?: string; guestCount?: string; nightlyRate?: string; publishStatus?: string; paidUntil?: string;
};
export type Inquiry = { id: string; listingId: string; name: string; email: string; phone: string; reason: string; message: string; createdAt: string };
type ListingRow = { id:string; title:string; city:string; state:string; property_type:string; bedrooms:number; bathrooms:number; host_name:string; description:string; amenities:string[]; rules:string[]; analysis:GapAnalysis; source_url?:string|null; image_url?:string|null; rating?:string|null; reviews?:string|null; guest_count?:string|null; nightly_rate?:string|null; publish_status?:string|null; paid_until?:string|null };
type InquiryRow = { id:string; listing_id:string; name:string; email:string; phone?:string|null; reason?:string|null; message?:string|null; created_at:string };
export const sampleListing: Listing = {
  id: "sample",
  title: "Quiet furnished coastal stay with workspace",
  city: "Marco Island",
  state: "FL",
  propertyType: "Condo",
  bedrooms: 2,
  bathrooms: 2,
  hostName: "Sample Host",
  description: "A clean, fully furnished mid-term stay for relocation, insurance displacement, remote work, and between-home housing. Transparent monthly pricing and one clear all-in quote.",
  imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
  guestCount: "4",
  publishStatus: "published",
  amenities: ["Fast Wi-Fi", "Workspace", "Full kitchen", "Laundry", "Parking", "Utilities included"],
  rules: ["No smoking", "Pets considered", "Quiet hours after 10 PM", "Normal checkout cleaning only"],
  analysis: { id: "sample-gap", startDate: "2026-07-03", endDate: "2026-08-14", nights: 42, fullNightRevenue: 8820, likelyShortTermRevenue: 3780, likelyBookedNights: 18, recommendedNightly: 92, recommendedTotal: 3864, monthlyEquivalent: 2760, marketMonthlyRent: 2600, furnishedPremium: 1.18, marketAnchoredMonthly: 3068, turnoverSavings: 585, certaintyScore: 90, fillProbability: 0.43, recommendation: "furnished", explanation: ["42 open nights can be packaged as one furnished stay.", "The offer beats likely short-term revenue while reducing guest turnover.", "All-in pricing is easier for guests to trust."] }
};
const listingsKey = "gapstay:listings";
const inquiriesKey = "gapstay:inquiries";

export function getListings(): Listing[] { if (typeof window === "undefined") return [sampleListing]; try { const raw = localStorage.getItem(listingsKey); return raw ? [sampleListing, ...JSON.parse(raw).filter((x: Listing) => x.id !== "sample")] : [sampleListing]; } catch { return [sampleListing]; } }
export function getListing(id: string) { return getListings().find(x => x.id === id); }
export function saveListing(listing: Listing) { const existing = getListings().filter(x => x.id !== "sample" && x.id !== listing.id); localStorage.setItem(listingsKey, JSON.stringify([listing, ...existing])); }
export function getInquiries(): Inquiry[] { if (typeof window === "undefined") return []; try { return JSON.parse(localStorage.getItem(inquiriesKey) || "[]"); } catch { return []; } }
export function saveInquiry(inquiry: Inquiry) { localStorage.setItem(inquiriesKey, JSON.stringify([inquiry, ...getInquiries()])); }

function fromRow(row: ListingRow): Listing {
  return { id: row.id, title: row.title, city: row.city, state: row.state, propertyType: row.property_type, bedrooms: Number(row.bedrooms || 0), bathrooms: Number(row.bathrooms || 0), hostName: row.host_name, description: row.description, amenities: row.amenities || [], rules: row.rules || [], analysis: row.analysis, sourceUrl: row.source_url || undefined, imageUrl: row.image_url || undefined, rating: row.rating || undefined, reviews: row.reviews || undefined, guestCount: row.guest_count || undefined, nightlyRate: row.nightly_rate || undefined, publishStatus: row.publish_status || "preview", paidUntil: row.paid_until || undefined };
}

export function getOwnerToken() {
  if (typeof window === "undefined") return "";
  const key = "gapstay:owner-token";
  let token = localStorage.getItem(key);
  if (!token) {
    token = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    localStorage.setItem(key, token);
  }
  return token;
}

export function setOwnerToken(token:string){
  if(typeof window!=="undefined"&&token) localStorage.setItem("gapstay:owner-token",token);
}

export async function saveListingRemote(listing: Listing, ownerEmail?: string) {
  const response = await fetch("/api/listings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listing, ownerEmail, ownerToken: getOwnerToken() }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.listing) throw new Error(data.message || "Could not save listing.");
  const saved = data.listing as Listing;
  saveListing(saved);
  return saved;
}
export async function getListingRemote(id: string) {
  if (id === "sample") return sampleListing;
  const response = await fetch(`/api/listings?id=${encodeURIComponent(id)}`, { headers: { "x-gapstay-owner-token": getOwnerToken() }, cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.listing) return null;
  const listing = data.listing as Listing;
  saveListing(listing);
  return listing;
}
export async function getListingsRemote() {
  const data = await getDashboardRemote();
  return [sampleListing, ...data.listings.filter((x: Listing) => x.id !== "sample")];
}
export async function saveInquiryRemote(inquiry: Inquiry) {
  const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(inquiry) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Could not send inquiry.");
  return inquiry;
}
export async function getInquiriesRemote() {
  const data = await getDashboardRemote();
  return data.inquiries;
}

async function getDashboardRemote(): Promise<{ listings: Listing[]; inquiries: Inquiry[] }> {
  const response = await fetch("/api/dashboard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ownerToken: getOwnerToken() }), cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Could not load dashboard.");
  return {
    listings: (data.listings || []).map(fromRow),
    inquiries: (data.inquiries || []).map((row:InquiryRow)=>({ id:row.id, listingId:row.listing_id, name:row.name, email:row.email, phone:row.phone || "", reason:row.reason || "", message:row.message || "", createdAt:row.created_at }))
  };
}