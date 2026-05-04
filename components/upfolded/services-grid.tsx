import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Service {
  name: string;
  href: string;
  image: string;
  alt: string;
  blurb: string;
}

// hrefs point at /#quote-form for services that don't have dedicated pages yet
// (roof-repairs, chimney-repairs, flat-roofing, fascias-soffits). The three
// pages that do exist (guttering, bird-proofing, exterior-painting) link to
// themselves so they pick up the SEO from internal linking.
const services: Service[] = [
  {
    name: "Roof Repairs",
    href: "#quote-form",
    image: "/images/roof-repairs.webp",
    alt: "Roofer fixing a tiled roof in Kent",
    blurb:
      "Slipped tiles, lead work, leaks, ridge tiles. The usual suspects, sorted same day.",
  },
  {
    name: "Guttering",
    href: "/guttering",
    image: "/images/guttering.webp",
    alt: "New black guttering fitted to a Kent house",
    blurb: "Clear, repair, replace. UPVC and cast iron, every fall checked.",
  },
  {
    name: "Chimney Repairs",
    href: "#quote-form",
    image: "/images/chimney.webp",
    alt: "Brick chimney with fresh pointing and lead flashing",
    blurb: "Pointing, flashing, capping, lead work. Done before the next storm.",
  },
  {
    name: "Flat Roofing",
    href: "#quote-form",
    image: "/images/flat-roofing.webp",
    alt: "Flat roof with EPDM rubber membrane",
    blurb: "EPDM, GRP fibreglass, felt. Garages, extensions, dormers.",
  },
  {
    name: "Fascias & Soffits",
    href: "#quote-form",
    image: "/images/fascias-soffits.webp",
    alt: "Newly fitted white UPVC fascias and soffits",
    blurb: "Replace rotten timber, refit UPVC. Crisp lines, no more rot.",
  },
  {
    name: "Bird Proofing",
    href: "/bird-proofing",
    image: "/images/bird-proofing.webp",
    alt: "Bird proofing mesh fitted under solar panels",
    blurb: "Mesh and spikes for solar panels and roof voids. Pigeons evicted.",
  },
];

export function ServicesGrid() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
          <span className="inline-block bg-copper-50 text-copper-700 font-semibold text-xs uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
            What I fix
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5 text-balance tracking-tight">
            Every roof job, sorted properly
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            From a single slipped tile to a full re-roof. If it&rsquo;s roofing,
            it&rsquo;s me.
          </p>
        </div>

        {/* Service grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 transition-all duration-200 hover:border-copper/40 hover:shadow-soft-lg hover:-translate-y-0.5"
            >
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-semibold text-xl text-slate-900 mb-2 leading-snug">
                  {service.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  {service.blurb}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-copper-700 group-hover:gap-2.5 transition-all">
                  Learn more
                  <ArrowRight
                    className="h-4 w-4 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
