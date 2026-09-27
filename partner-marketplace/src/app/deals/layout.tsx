import type { Metadata } from "next";
import type { ReactNode } from "react";

// Private negotiation threads between one advertiser and one publisher.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DealsLayout({ children }: { children: ReactNode }) {
  return children;
}
