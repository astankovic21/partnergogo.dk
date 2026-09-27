import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Publisher marketplace",
  description:
    "Browse affiliate websites, newsletters, influencers, apps and other publishers by GEO, vertical, traffic source and audience size — and invite the right ones to your campaign.",
};

export default function MarketplacePublishersLayout({ children }: { children: ReactNode }) {
  return children;
}
