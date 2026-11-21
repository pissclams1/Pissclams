import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Deck from "@/components/Deck";
import { db, isUuid } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function load(id: string) {
  if (!isUuid(id)) return null;
  const { data } = await db().from("creations").select("id,title,creator_name,image_url").eq("id", id).eq("active", true).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const c = await load((await params).id);
  if (!c) return {};
  const title = `"${c.title}" by ${c.creator_name} on Adagio`;
  const description = "Swipe through AI-made art at your own pace.";
  // image_url is resolved against metadataBase when it is a relative path
  return {
    title, description,
    openGraph: { title, description, siteName: "Adagio", type: "website", images: [{ url: c.image_url, alt: c.title }] },
    twitter: { card: "summary_large_image", title, description, images: [c.image_url] },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  if (!(await load(id))) notFound();
  return <Deck first={id} />;
}
