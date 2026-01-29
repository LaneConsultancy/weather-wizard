import { MetadataRoute } from 'next';
import { getAllAreaSlugs } from '@/lib/areas';
import { SITE_URL } from '@/lib/config';

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

  return [mainPage, ...areaPages];
}
