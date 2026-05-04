import Link from "next/link";
import { getAllAreas, getNearbyAreas } from "@/lib/areas";
import type { Area } from "@/lib/areas";

interface AreasCoveredProps {
  /**
   * When provided, renders the "we also serve nearby areas" variant for an
   * individual area page. The current area is excluded from the grid and its
   * nearby areas are surfaced first. Omit for the Kent-wide homepage variant.
   */
  currentArea?: Area;
}

/**
 * The slug for the generic "Kent" entry in areas data. This is the county-wide
 * entry used for the homepage — it should never appear as a link inside the
 * grid because it has no meaningful sub-area page of its own.
 */
const KENT_SLUG = "kent";

/**
 * Sorts a list of areas so that a prioritised subset (e.g. nearby areas)
 * appears first, with the remainder sorted alphabetically by name.
 */
function sortAreasWithPriority(areas: Area[], priorityAreas: Area[]): Area[] {
  const prioritySlugs = new Set(priorityAreas.map((a) => a.slug));
  const priority = areas.filter((a) => prioritySlugs.has(a.slug));
  const rest = areas
    .filter((a) => !prioritySlugs.has(a.slug))
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...priority, ...rest];
}

export function AreasCovered({ currentArea }: AreasCoveredProps) {
  const allAreas = getAllAreas();

  // Always exclude the generic Kent entry — it is the homepage, not a sub-area.
  const subAreas = allAreas.filter((a) => a.slug !== KENT_SLUG);

  if (currentArea) {
    return (
      <AreaVariant allSubAreas={subAreas} currentArea={currentArea} />
    );
  }

  return <KentWideVariant allSubAreas={subAreas} />;
}

// ---------------------------------------------------------------------------
// Kent-wide variant (homepage)
// ---------------------------------------------------------------------------

interface KentWideVariantProps {
  allSubAreas: Area[];
}

function KentWideVariant({ allSubAreas }: KentWideVariantProps) {
  // Alphabetical order for the homepage grid.
  const sorted = [...allSubAreas].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="relative py-20 md:py-28 bg-cream overflow-hidden">
      {/* Subtle background decoration */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-96 h-96 bg-copper/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-72 h-72 bg-slate-200/50 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"
      />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          eyebrow="Coverage"
          heading="Proudly Serving Kent"
          subheading="Click your area for local roofing services"
        />

        <AreaGrid areas={sorted} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Per-area variant (area landing pages)
// ---------------------------------------------------------------------------

interface AreaVariantProps {
  allSubAreas: Area[];
  currentArea: Area;
}

function AreaVariant({ allSubAreas, currentArea }: AreaVariantProps) {
  // Exclude the page's own area from the grid.
  const otherAreas = allSubAreas.filter((a) => a.slug !== currentArea.slug);

  // Resolve nearby areas to full Area objects so we can surface them first.
  const nearbyAreas = getNearbyAreas(currentArea.slug);

  const sorted = sortAreasWithPriority(otherAreas, nearbyAreas);

  return (
    <section className="relative py-20 md:py-28 bg-cream overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-96 h-96 bg-copper/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-72 h-72 bg-slate-200/50 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"
      />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          eyebrow="Coverage"
          heading="Also Serving Nearby"
          subheading={`Based in Maidstone, I cover most of Kent, including ${currentArea.name} and the surrounding areas listed below.`}
        />

        <AreaGrid areas={sorted} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Shared presentational components
// ---------------------------------------------------------------------------

interface SectionHeaderProps {
  eyebrow: string;
  heading: string;
  subheading: string;
}

function SectionHeader({ eyebrow, heading, subheading }: SectionHeaderProps) {
  return (
    <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
      <span className="inline-block bg-copper-50 text-copper-700 font-semibold text-xs uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5 text-balance tracking-tight">
        {heading}
      </h2>
      <p className="text-lg text-slate-600 leading-relaxed">{subheading}</p>
    </div>
  );
}

interface AreaGridProps {
  areas: Area[];
}

function AreaGrid({ areas }: AreaGridProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {areas.map((area) => (
          <Link
            key={area.slug}
            href={`/${area.slug}`}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-200 hover:border-copper/40 hover:bg-copper/5 text-slate-700 font-medium transition-all hover:-translate-y-0.5"
          >
            {area.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
