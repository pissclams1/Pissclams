import { createClient } from "@supabase/supabase-js";
import type { GapAnalysis } from "./pricing";
import type { Inquiry, Listing } from "./store";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getGapStayAdmin() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

type ListingRow = {
  id: string;
  title: string;
  city: string;
  state: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  host_name: string;
  description: string;
  amenities: string[];
  rules: string[];
  analysis: GapAnalysis;
  owner_email?: string | null;
  publish_status?: string | null;
};

export function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    city: row.city,
    state: row.state,
    propertyType: row.property_type,
    bedrooms: Number(row.bedrooms || 0),
    bathrooms: Number(row.bathrooms || 0),
    hostName: row.host_name,
    description: row.description,
    amenities: row.amenities || [],
    rules: row.rules || [],
    analysis: row.analysis
  };
}

export function toListingRow(listing: Listing, ownerEmail?: string | null) {
  return {
    id: listing.id,
    title: listing.title,
    city: listing.city,
    state: listing.state,
    property_type: listing.propertyType,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    host_name: listing.hostName,
    description: listing.description,
    amenities: listing.amenities,
    rules: listing.rules,
    analysis: listing.analysis,
    owner_email: ownerEmail || null,
    publish_status: "preview"
  };
}

export function toInquiryRow(inquiry: Inquiry) {
  return {
    id: inquiry.id,
    listing_id: inquiry.listingId,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    reason: inquiry.reason,
    message: inquiry.message,
    created_at: inquiry.createdAt
  };
}
