import type { MetadataRoute } from "next";
import { publishers, campaigns, distributionRequests, trafficListings } from "@/lib/mock-data";

const siteUrl = "https://partnergogo.dk";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/marketplace/publishers`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/marketplace/campaigns`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/distribution`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/traffic`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const publisherRoutes: MetadataRoute.Sitemap = publishers.map((p) => ({
    url: `${siteUrl}/publishers/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const campaignRoutes: MetadataRoute.Sitemap = campaigns.map((c) => ({
    url: `${siteUrl}/campaigns/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const distributionRoutes: MetadataRoute.Sitemap = distributionRequests.map((r) => ({
    url: `${siteUrl}/distribution/${r.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const trafficRoutes: MetadataRoute.Sitemap = trafficListings.map((t) => ({
    url: `${siteUrl}/traffic/${t.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...publisherRoutes, ...campaignRoutes, ...distributionRoutes, ...trafficRoutes];
}
