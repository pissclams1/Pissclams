import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

// Self-hosted via @fontsource-variable, loaded through next/font (no runtime request to Google).
const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900", variable: "--font-inter", display: "swap",
});
const fraunces = localFont({
  src: "../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2",
  weight: "100 900", variable: "--font-fraunces", display: "swap",
});

const site = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "Adagio: a gallery for AI art",
  description: "Swipe through AI-made art at your own pace. Love what moves you, move on from the rest.",
  openGraph: { title: "Adagio: a gallery for AI art", siteName: "Adagio", type: "website" },
};
export const viewport: Viewport = { themeColor: "#0B0B0C", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${inter.variable} ${fraunces.variable}`}><body>{children}</body></html>;
}
