import { Area } from '../areas';

export interface AreaContent {
  heroHeadline: string;
  heroSubheadline: string;
  trustSignal: string;
  serviceAreaDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

/**
 * Generate area-specific content for a given area
 */
export function generateAreaContent(area: Area): AreaContent {
  const nearbyAreasText = area.nearbyAreas.slice(0, 3).join(', ');

  return {
    heroHeadline: `${area.name} Roof Problem?\nI'll Fix It Properly.`,
    heroSubheadline: `After 25 years fixing Kent roofs, I've seen every problem going. Based in Maidstone, I cover ${area.name} and all of ${area.county}. I answer my own phone, turn up when I say I will, and give you a fixed price before any work starts.`,
    trustSignal: `25+ Years Fixing ${area.name} Roofs`,
    serviceAreaDescription: `Based in Maidstone, covering ${area.displayName}, ${nearbyAreasText} and surrounding areas`,
    metaTitle: `Roofer in ${area.name} | 25 Years Experience | Weather Wizard`,
    metaDescription: `Need a roofer in ${area.displayName}? 25 years' experience, public liability insured. I answer my phone, give fixed prices, and fix roofs properly. Call 0800 316 2922.`,
    keywords: [
      `roofer ${area.name.toLowerCase()}`,
      `roof repairs ${area.name.toLowerCase()}`,
      `roofing ${area.name.toLowerCase()}`,
      `guttering ${area.name.toLowerCase()}`,
      `${area.name.toLowerCase()} roofing services`,
      `emergency roofer ${area.name.toLowerCase()}`,
      ...area.postcodes.map(pc => `roofer ${pc}`),
    ],
  };
}

/**
 * Generate CTA text with area name
 */
export function generateAreaCTA(area: Area, service: string): string {
  return `Get ${service} in ${area.name}`;
}

/**
 * Generate service-specific headlines for area
 */
export function generateServiceHeadline(area: Area, service: string): string {
  return `Professional ${service} Services in ${area.name}`;
}

/**
 * Generate trust signal variations
 */
export function generateTrustSignals(area: Area) {
  return {
    experience: "25+ Years' Experience",
    insured: 'Public Liability Insured',
    location: 'Based in Maidstone',
    coverage: `Covering ${area.name}`,
  };
}

/**
 * Generate nearby areas text for display
 */
export function generateNearbyAreasText(area: Area): string {
  if (area.nearbyAreas.length === 0) {
    return 'and surrounding areas in Kent';
  }

  const nearbyText = area.nearbyAreas.join(', ');
  return `${nearbyText}, and surrounding areas`;
}

/**
 * Generate structured data for local business
 */
export function generateLocalBusinessStructuredData(area: Area) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: `Weather Wizard - ${area.name}`,
    description: `Professional roofing services in ${area.displayName}. 25 years' experience, public liability insured.`,
    url: `https://weatherwizard.co.uk/${area.slug}`,
    telephone: '08003162922',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Maidstone',
      addressRegion: 'Kent',
      addressCountry: 'GB',
    },
    areaServed: {
      '@type': 'City',
      name: area.name,
      containedIn: {
        '@type': 'AdministrativeArea',
        name: area.county,
      },
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: area.coordinates.lat,
      longitude: area.coordinates.lng,
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: area.coordinates.lat,
        longitude: area.coordinates.lng,
      },
      geoRadius: '15000', // 15km radius
    },
    // Note: aggregateRating removed - new business, no reviews yet
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(area: Area) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://weatherwizard.co.uk',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: area.name,
        item: `https://weatherwizard.co.uk/${area.slug}`,
      },
    ],
  };
}
