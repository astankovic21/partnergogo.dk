import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Campaign marketplace",
  description:
    "Browse live affiliate and performance marketing campaigns by GEO, vertical and commission model — CPA, CPL, CPS, revenue share and hybrid deals.",
};

export default function MarketplaceCampaignsLayout({ children }: { children: ReactNode }) {
  return children;
}
