import { MetadataRoute } from 'next';
import { getAllAreaSlugs } from '@/lib/areas';
import { getAllServiceSlugs } from '@/lib/content/services';
import { SITE_URL } from '@/lib/config';

// Area slugs that have dedicated area-specific service pages
const TOP_AREA_SLUGS = ['maidstone', 'dartford', 'gillingham', 'chatham', 'ashford'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const currentDate = new Date();

  // Main page entry
  const mainPage = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };

  // Generate entries for all area pages
  const areaPages = getAllAreaSlugs().map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Kent-wide service pages (high priority — primary service pages)
  const servicePages = getAllServiceSlugs().map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Area-specific service pages (top 5 towns × 3 services = 15 pages)
  const areaServicePages = TOP_AREA_SLUGS.flatMap((areaSlug) =>
    getAllServiceSlugs().map((serviceSlug) => ({
      url: `${baseUrl}/${areaSlug}/${serviceSlug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  return [mainPage, ...areaPages, ...servicePages, ...areaServicePages];
}
