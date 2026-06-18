import type { GapAnalysis } from "./pricing";
import { getSupabaseBrowserClient } from "./supabase";

export type Listing = {
  id: string; title: string; city: string; state: string; propertyType: string; bedrooms: number; bathrooms: number; hostName: string; description: string; amenities: string[]; rules: string[]; analysis: GapAnalysis;
};
export type Inquiry = { id: string; listingId: string; name: string; email: string; phone: string; reason: string; message: string; createdAt: string };
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
  amenities: ["Fast Wi-Fi", "Workspace", "Full kitchen", "Laundry", "Parking", "Utilities included"],
  rules: ["No smoking", "Pets considered", "Quiet hours after 10 PM", "Normal checkout cleaning only"],
  analysis: { id: "sample-gap", startDate: "2026-07-03", endDate: "2026-08-14", nights: 42, fullNightRevenue: 8820, likelyShortTermRevenue: 3780, likelyBookedNights: 18, recommendedNightly: 92, recommendedTotal: 3864, monthlyEquivalent: 2760, turnoverSavings: 585, certaintyScore: 90, explanation: ["42 open nights can be packaged as one furnished stay.", "The offer beats likely short-term revenue while reducing guest turnover.", "All-in pricing is easier for guests to trust."] }
};
const listingsKey = "gapstay:listings";
const inquiriesKey = "gapstay:inquiries";

export function getListings(): Listing[] { if (typeof window === "undefined") return [sampleListing]; try { const raw = localStorage.getItem(listingsKey); return raw ? [sampleListing, ...JSON.parse(raw).filter((x: Listing) => x.id !== "sample")] : [sampleListing]; } catch { return [sampleListing]; } }
export function getListing(id: string) { return getListings().find(x => x.id === id); }
export function saveListing(listing: Listing) { const existing = getListings().filter(x => x.id !== "sample" && x.id !== listing.id); localStorage.setItem(listingsKey, JSON.stringify([listing, ...existing])); }
export function getInquiries(): Inquiry[] { if (typeof window === "undefined") return []; try { return JSON.parse(localStorage.getItem(inquiriesKey) || "[]"); } catch { return []; } }
export function saveInquiry(inquiry: Inquiry) { localStorage.setItem(inquiriesKey, JSON.stringify([inquiry, ...getInquiries()])); }

function fromRow(row: any): Listing {
  return { id: row.id, title: row.title, city: row.city, state: row.state, propertyType: row.property_type, bedrooms: Number(row.bedrooms || 0), bathrooms: Number(row.bathrooms || 0), hostName: row.host_name, description: row.description, amenities: row.amenities || [], rules: row.rules || [], analysis: row.analysis };
}
function toRow(listing: Listing, ownerEmail?: string) {
  return { id: listing.id, title: listing.title, city: listing.city, state: listing.state, property_type: listing.propertyType, bedrooms: listing.bedrooms, bathrooms: listing.bathrooms, host_name: listing.hostName, description: listing.description, amenities: listing.amenities, rules: listing.rules, analysis: listing.analysis, owner_email: ownerEmail || null, publish_status: "preview" };
}

export async function saveListingRemote(listing: Listing, ownerEmail?: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) { saveListing(listing); return listing; }
  const { data, error } = await supabase.from("gapstay_listings").upsert(toRow(listing, ownerEmail)).select("*").single();
  if (error) { console.error(error.message); saveListing(listing); return listing; }
  const saved = fromRow(data);
  saveListing(saved);
  return saved;
}
export async function getListingRemote(id: string) {
  if (id === "sample") return sampleListing;
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return getListing(id) || null;
  const { data, error } = await supabase.from("gapstay_listings").select("*").eq("id", id).single();
  if (error || !data) return getListing(id) || null;
  const listing = fromRow(data);
  saveListing(listing);
  return listing;
}
export async function getListingsRemote() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return getListings();
  const { data, error } = await supabase.from("gapstay_listings").select("*").order("created_at", { ascending: false }).limit(50);
  if (error || !data) return getListings();
  return [sampleListing, ...data.filter((x:any)=>x.id !== "sample").map(fromRow)];
}
export async function saveInquiryRemote(inquiry: Inquiry) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) { saveInquiry(inquiry); return inquiry; }
  const row = { id: inquiry.id, listing_id: inquiry.listingId, name: inquiry.name, email: inquiry.email, phone: inquiry.phone, reason: inquiry.reason, message: inquiry.message, created_at: inquiry.createdAt, request_state: "new" };
  const { error } = await supabase.from("gapstay_inquiries").insert(row);
  if (error) console.error(error.message);
  saveInquiry(inquiry);
  return inquiry;
}
export async function getInquiriesRemote() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return getInquiries();
  const { data, error } = await supabase.from("gapstay_inquiries").select("*").order("created_at", { ascending: false }).limit(100);
  if (error || !data) return getInquiries();
  return data.map((r:any)=>({ id:r.id, listingId:r.listing_id, name:r.name, email:r.email, phone:r.phone || "", reason:r.reason || "", message:r.message || "", createdAt:r.created_at }));
}
