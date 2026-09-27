import type { MetadataRoute } from "next";

const siteUrl = "https://partnergogo.dk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/advertiser/",
          "/publisher/",
          "/deals/",
          "/onboarding/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
