import type { GapAnalysis } from "./pricing";

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
