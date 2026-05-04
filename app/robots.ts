import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Explicitly allow Meta's crawlers — we rely on Meta domain verification
      // and ad scraping, so ensure they are never accidentally blocked.
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "Facebot",
        allow: "/",
      },
    ],
    sitemap: "https://www.weatherwizardroofing.co.uk/sitemap.xml",
  };
}
