import type { AdvertiserProfile } from "@/types";

// Fictional advertiser companies (webshops, SaaS, subscription businesses).
export const advertisers: AdvertiserProfile[] = [
  {
    id: "adv_01",
    userId: "user_adv_01",
    companyName: "Lumora Home",
    website: "https://lumorahome.com",
    industry: "Home",
    description:
      "Scandinavian design-led home goods and furniture webshop shipping across the Nordics and Germany.",
    approved: true,
  },
  {
    id: "adv_02",
    userId: "user_adv_02",
    companyName: "Pennywise Finance",
    website: "https://pennywisefinance.com",
    industry: "Finance",
    description:
      "Digital consumer loan and credit card provider operating across Denmark, Sweden, and Norway.",
    approved: true,
  },
  {
    id: "adv_03",
    userId: "user_adv_03",
    companyName: "Skyline Travel Co.",
    website: "https://skylinetravel.com",
    industry: "Travel",
    description:
      "Online travel agency specializing in city breaks and package holidays from the Nordics.",
    approved: true,
  },
  {
    id: "adv_04",
    userId: "user_adv_04",
    companyName: "Verde Fashion",
    website: "https://verdefashion.com",
    industry: "Fashion",
    description:
      "Sustainable fashion ecommerce brand with a fast-growing DTC presence in Northern Europe.",
    approved: true,
  },
  {
    id: "adv_05",
    userId: "user_adv_05",
    companyName: "Flowline SaaS",
    website: "https://flowline.io",
    industry: "Software",
    description:
      "B2B workflow-automation SaaS platform selling subscriptions to SMBs across Europe.",
    approved: true,
  },
  {
    id: "adv_06",
    userId: "user_adv_06",
    companyName: "SafeHarbor Insurance",
    website: "https://safeharborinsurance.com",
    industry: "Insurance",
    description:
      "Digital-first home and contents insurance provider expanding across the DACH region.",
    approved: true,
  },
  {
    id: "adv_07",
    userId: "user_adv_07",
    companyName: "Glow & Co",
    website: "https://glowandco.com",
    industry: "Beauty",
    description:
      "Clean-beauty skincare and cosmetics brand selling direct-to-consumer online.",
    approved: true,
  },
  {
    id: "adv_08",
    userId: "user_adv_08",
    companyName: "PulsePlay Gaming",
    website: "https://pulseplay.gg",
    industry: "Gaming",
    description:
      "Mobile gaming studio and subscription rewards platform for casual gamers.",
    approved: false,
  },
];

export function getAdvertiserById(id: string): AdvertiserProfile | undefined {
  return advertisers.find((a) => a.id === id);
}
