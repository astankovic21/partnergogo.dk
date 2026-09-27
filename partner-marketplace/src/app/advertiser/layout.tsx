import type { Metadata } from "next";
import type { ReactNode } from "react";

// Logged-in advertiser workspace — not marketing content, keep out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdvertiserLayout({ children }: { children: ReactNode }) {
  return children;
}
