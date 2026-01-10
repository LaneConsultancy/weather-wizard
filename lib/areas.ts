export interface Area {
  slug: string;
  name: string;
  displayName: string;
  county: string;
  coordinates: { lat: number; lng: number };
  postcodes: string[];
  nearbyAreas: string[];
  localLandmarks?: string[];
  population?: number;
}

// Area data enriched with metadata
const areasData: Area[] = [
  {
    slug: "kent",
    name: "Kent",
    displayName: "Kent",
    county: "Kent",
    coordinates: { lat: 51.2787, lng: 0.5217 },
    postcodes: ["ME", "CT", "TN", "DA"],
    nearbyAreas: ["Dartford", "Maidstone", "Canterbury", "Sevenoaks"],
    localLandmarks: ["Leeds Castle", "Canterbury Cathedral", "Dover Castle"],
    population: 1800000
  },
  {
    slug: "dartford",
    name: "Dartford",
    displayName: "Dartford, Kent",
    county: "Kent",
    coordinates: { lat: 51.4464, lng: 0.2186 },
    postcodes: ["DA1", "DA2", "DA3", "DA4"],
    nearbyAreas: ["Gravesend", "Northfleet", "Swanley"],
    localLandmarks: ["Dartford Bridge", "Bluewater Shopping Centre", "Central Park"],
    population: 116000
  },
  {
    slug: "sevenoaks",
    name: "Sevenoaks",
    displayName: "Sevenoaks, Kent",
    county: "Kent",
    coordinates: { lat: 51.2725, lng: 0.1871 },
    postcodes: ["TN13", "TN14", "TN15"],
    nearbyAreas: ["Tonbridge", "Bromley", "Orpington"],
    localLandmarks: ["Knole House", "Sevenoaks Wildlife Reserve", "Bradbourne Lakes"],
    population: 30000
  },
  {
    slug: "maidstone",
    name: "Maidstone",
    displayName: "Maidstone, Kent",
    county: "Kent",
    coordinates: { lat: 51.2704, lng: 0.5227 },
    postcodes: ["ME14", "ME15", "ME16", "ME17"],
    nearbyAreas: ["Aylesford", "Chatham", "Gillingham"],
    localLandmarks: ["Leeds Castle", "Maidstone Museum", "Mote Park"],
    population: 173000
  },
  {
    slug: "sittingbourne",
    name: "Sittingbourne",
    displayName: "Sittingbourne, Kent",
    county: "Kent",
    coordinates: { lat: 51.3409, lng: 0.7336 },
    postcodes: ["ME9", "ME10"],
    nearbyAreas: ["Faversham", "Sheerness", "Queenborough"],
    localLandmarks: ["Milton Creek", "Sittingbourne Heritage Museum"],
    population: 48000
  },
  {
    slug: "folkestone",
    name: "Folkestone",
    displayName: "Folkestone, Kent",
    county: "Kent",
    coordinates: { lat: 51.0814, lng: 1.1698 },
    postcodes: ["CT18", "CT19", "CT20"],
    nearbyAreas: ["Hythe", "Dover", "Ashford"],
    localLandmarks: ["Folkestone Harbour", "The Leas Coastal Park", "Channel Tunnel Terminal"],
    population: 51000
  },
  {
    slug: "canterbury",
    name: "Canterbury",
    displayName: "Canterbury, Kent",
    county: "Kent",
    coordinates: { lat: 51.2802, lng: 1.0789 },
    postcodes: ["CT1", "CT2", "CT3", "CT4"],
    nearbyAreas: ["Whitstable", "Herne Bay", "Faversham"],
    localLandmarks: ["Canterbury Cathedral", "St Augustine's Abbey", "Canterbury Castle"],
    population: 55000
  },
  {
    slug: "gravesend",
    name: "Gravesend",
    displayName: "Gravesend, Kent",
    county: "Kent",
    coordinates: { lat: 51.4415, lng: 0.3704 },
    postcodes: ["DA11", "DA12", "DA13"],
    nearbyAreas: ["Dartford", "Northfleet", "Rochester"],
    localLandmarks: ["Gravesend Promenade", "Windmill Hill", "Pocahontas Statue"],
    population: 74000
  },
  {
    slug: "ditton",
    name: "Ditton",
    displayName: "Ditton, Kent",
    county: "Kent",
    coordinates: { lat: 51.2983, lng: 0.4451 },
    postcodes: ["ME20"],
    nearbyAreas: ["Maidstone", "Aylesford", "Larkfield"],
    localLandmarks: ["Ditton Community Centre", "Ditton Fields"],
    population: 7000
  },
  {
    slug: "ashford",
    name: "Ashford",
    displayName: "Ashford, Kent",
    county: "Kent",
    coordinates: { lat: 51.1465, lng: 0.8750 },
    postcodes: ["TN23", "TN24", "TN25", "TN26"],
    nearbyAreas: ["Folkestone", "Canterbury", "Tenterden"],
    localLandmarks: ["Godinton House", "Ashford Designer Outlet", "Victoria Park"],
    population: 75000
  },
  {
    slug: "northfleet",
    name: "Northfleet",
    displayName: "Northfleet, Kent",
    county: "Kent",
    coordinates: { lat: 51.4471, lng: 0.3389 },
    postcodes: ["DA11"],
    nearbyAreas: ["Gravesend", "Dartford", "Swanscombe"],
    localLandmarks: ["Northfleet Green", "Ebbsfleet International"],
    population: 27000
  },
  {
    slug: "chatham",
    name: "Chatham",
    displayName: "Chatham, Kent",
    county: "Kent",
    coordinates: { lat: 51.3797, lng: 0.5250 },
    postcodes: ["ME4", "ME5"],
    nearbyAreas: ["Rochester", "Gillingham", "Maidstone"],
    localLandmarks: ["Chatham Historic Dockyard", "Fort Amherst", "Pentagon Shopping Centre"],
    population: 76000
  },
  {
    slug: "gillingham",
    name: "Gillingham",
    displayName: "Gillingham, Kent",
    county: "Kent",
    coordinates: { lat: 51.3886, lng: 0.5505 },
    postcodes: ["ME7", "ME8"],
    nearbyAreas: ["Chatham", "Rochester", "Rainham"],
    localLandmarks: ["Gillingham Pier", "Great Lines Heritage Park", "Capstone Farm Country Park"],
    population: 104000
  },
  {
    slug: "whitstable",
    name: "Whitstable",
    displayName: "Whitstable, Kent",
    county: "Kent",
    coordinates: { lat: 51.3607, lng: 1.0261 },
    postcodes: ["CT5"],
    nearbyAreas: ["Herne Bay", "Canterbury", "Faversham"],
    localLandmarks: ["Whitstable Harbour", "Tankerton Slopes", "Whitstable Castle"],
    population: 32000
  },
  {
    slug: "herne-bay",
    name: "Herne Bay",
    displayName: "Herne Bay, Kent",
    county: "Kent",
    coordinates: { lat: 51.3726, lng: 1.1316 },
    postcodes: ["CT6"],
    nearbyAreas: ["Whitstable", "Canterbury", "Margate"],
    localLandmarks: ["Herne Bay Pier", "Reculver Towers", "Memorial Park"],
    population: 39000
  },
  {
    slug: "hastings",
    name: "Hastings",
    displayName: "Hastings, East Sussex",
    county: "East Sussex",
    coordinates: { lat: 50.8551, lng: 0.5728 },
    postcodes: ["TN34", "TN35", "TN37", "TN38"],
    nearbyAreas: ["Bexhill", "Battle", "Rye"],
    localLandmarks: ["Hastings Castle", "Hastings Pier", "Old Town"],
    population: 92000
  },
  {
    slug: "ramsgate",
    name: "Ramsgate",
    displayName: "Ramsgate, Kent",
    county: "Kent",
    coordinates: { lat: 51.3360, lng: 1.4160 },
    postcodes: ["CT11", "CT12"],
    nearbyAreas: ["Broadstairs", "Margate", "Sandwich"],
    localLandmarks: ["Ramsgate Royal Harbour", "Ramsgate Tunnels", "Pugin's Church"],
    population: 42000
  },
  {
    slug: "dover",
    name: "Dover",
    displayName: "Dover, Kent",
    county: "Kent",
    coordinates: { lat: 51.1279, lng: 1.3134 },
    postcodes: ["CT16", "CT17"],
    nearbyAreas: ["Folkestone", "Deal", "Canterbury"],
    localLandmarks: ["Dover Castle", "White Cliffs of Dover", "Dover Harbour"],
    population: 32000
  },
  {
    slug: "margate",
    name: "Margate",
    displayName: "Margate, Kent",
    county: "Kent",
    coordinates: { lat: 51.3858, lng: 1.3850 },
    postcodes: ["CT9"],
    nearbyAreas: ["Broadstairs", "Ramsgate", "Herne Bay"],
    localLandmarks: ["Turner Contemporary", "Margate Main Sands", "Dreamland"],
    population: 61000
  },
  {
    slug: "broadstairs",
    name: "Broadstairs",
    displayName: "Broadstairs, Kent",
    county: "Kent",
    coordinates: { lat: 51.3587, lng: 1.4393 },
    postcodes: ["CT10"],
    nearbyAreas: ["Ramsgate", "Margate", "Sandwich"],
    localLandmarks: ["Viking Bay", "Bleak House", "Broadstairs Bandstand"],
    population: 25000
  },
  {
    slug: "rochester",
    name: "Rochester",
    displayName: "Rochester, Kent",
    county: "Kent",
    coordinates: { lat: 51.3877, lng: 0.5046 },
    postcodes: ["ME1", "ME2"],
    nearbyAreas: ["Chatham", "Gillingham", "Strood"],
    localLandmarks: ["Rochester Castle", "Rochester Cathedral", "Guildhall Museum"],
    population: 63000
  }
];

/**
 * Get all areas
 */
export function getAllAreas(): Area[] {
  return areasData;
}

/**
 * Get an area by its slug
 */
export function getAreaBySlug(slug: string): Area | undefined {
  return areasData.find(area => area.slug === slug);
}

/**
 * Get nearby areas for a given area
 */
export function getNearbyAreas(areaSlug: string): Area[] {
  const area = getAreaBySlug(areaSlug);
  if (!area) return [];

  return areasData.filter(a =>
    area.nearbyAreas.some(nearbyName =>
      a.name.toLowerCase() === nearbyName.toLowerCase()
    )
  );
}

/**
 * Generate slug from area name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Get all area slugs for static page generation
 */
export function getAllAreaSlugs(): string[] {
  return areasData.map(area => area.slug);
}
