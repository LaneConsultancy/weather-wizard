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

  // Estimate homes protected based on population (roughly 10% penetration)
  const homesProtected = area.population
    ? Math.round((area.population * 0.10) / 100) * 100
    : 500;

  return {
    heroHeadline: `Expert Roofing Services in ${area.name}`,
    heroSubheadline: `Protecting ${area.name} homes for over 25 years`,
    trustSignal: `${homesProtected.toLocaleString()}+ ${area.name} Homes Protected`,
    serviceAreaDescription: `Based in ${area.displayName}, proudly serving ${nearbyAreasText} and surrounding areas`,
    metaTitle: `${area.name} Roofing Services | Weather Wizard | Roof Repairs & Guttering`,
    metaDescription: `Expert roofing services in ${area.displayName}. Local specialists in roof repairs, installations, guttering, fascias & soffits. 25+ years experience. Free quotes.`,
    keywords: [
      `roofing ${area.name.toLowerCase()}`,
      `roof repairs ${area.name.toLowerCase()}`,
      `roofer ${area.name.toLowerCase()}`,
      `guttering ${area.name.toLowerCase()}`,
      `fascias soffits ${area.name.toLowerCase()}`,
      `${area.name.toLowerCase()} roofing services`,
      `roof installation ${area.name.toLowerCase()}`,
      ...area.postcodes.map(pc => `roofing ${pc}`),
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
  const homesProtected = area.population
    ? Math.round((area.population * 0.10) / 100) * 100
    : 500;

  const projectsCompleted = Math.round(homesProtected * 1.5);
  const rating = 4.9;

  return {
    homesProtected: `${homesProtected.toLocaleString()}+ ${area.name} Homes Protected`,
    projectsCompleted: `${projectsCompleted.toLocaleString()}+ Projects Completed`,
    rating: `${rating} Star Rating`,
    experience: '25+ Years Experience',
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
    description: `Professional roofing services in ${area.displayName}`,
    url: `https://weatherwizard.co.uk/${area.slug}`,
    telephone: '01234567890', // Replace with actual phone
    address: {
      '@type': 'PostalAddress',
      addressLocality: area.name,
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '250',
    },
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
