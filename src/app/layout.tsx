import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DemoUserProvider } from "@/context/demo-user-context";

// NOTE: replace with the real production URL once deployed (and again if the
// domain changes) — this powers absolute URLs for Open Graph/Twitter images
// and canonical links.
const siteUrl = "https://partnergogo.dk";
const siteName = "PartnerGoGo";
const description =
  "Where performance meets distribution. A B2B marketplace matching advertisers to publishers for affiliate and performance marketing — discover partners, launch campaigns, and negotiate deals in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Where performance meets distribution`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    "affiliate marketing",
    "performance marketing",
    "publisher marketplace",
    "advertiser marketplace",
    "affiliate network alternative",
    "CPA marketing",
    "influencer partnerships",
  ],
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — Where performance meets distribution`,
    description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Where performance meets distribution`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <DemoUserProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </DemoUserProvider>
      </body>
    </html>
  );
}
