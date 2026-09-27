import type { Metadata } from "next";
import type { ReactNode } from "react";

// Logged-in publisher workspace — not marketing content, keep out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PublisherLayout({ children }: { children: ReactNode }) {
  return children;
}
