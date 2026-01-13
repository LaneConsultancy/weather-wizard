import Link from "next/link";
import { Area, getNearbyAreas } from "@/lib/areas";
import { MapPin, Navigation, ChevronRight, Building } from "lucide-react";

interface AreaLocalInfoProps {
  area: Area;
}

export function AreaLocalInfo({ area }: AreaLocalInfoProps) {
  const nearbyAreas = getNearbyAreas(area.slug);

  return (
    <section className="relative py-20 md:py-28 bg-cream overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-copper/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-200/50 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Local Information */}
          <div>
            <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
              Local Coverage
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Serving {area.displayName}
            </h2>

            <div className="space-y-6">
              {/* Service Area Card */}
              <div className="group bg-white rounded-xl p-6 shadow-soft border border-slate-100 hover:border-copper/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-copper/20 to-copper/5 group-hover:from-copper/30 group-hover:to-copper/10 transition-colors">
                    <MapPin className="w-5 h-5 text-copper" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Our Service Area</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      We&apos;re proud to serve {area.displayName} and the surrounding areas.
                      Our local knowledge means we understand the specific roofing
                      challenges faced by homes in {area.name}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Response Card */}
              <div className="group bg-white rounded-xl p-6 shadow-soft border border-slate-100 hover:border-copper/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-copper/20 to-copper/5 group-hover:from-copper/30 group-hover:to-copper/10 transition-colors">
                    <Navigation className="w-5 h-5 text-copper" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Quick Response Times</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Being locally based in Kent means we respond quickly to your roofing
                      needs in {area.name}. Emergency repairs or scheduled maintenance -
                      we&apos;re never far away.
                    </p>
                  </div>
                </div>
              </div>

              {/* Local Landmarks */}
              {area.localLandmarks && area.localLandmarks.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-soft border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Building className="w-5 h-5 text-copper" />
                    <h3 className="font-semibold text-slate-900">Landmarks We Serve Near</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {area.localLandmarks.map((landmark, index) => (
                      <span
                        key={index}
                        className="inline-block bg-slate-100 text-slate-700 text-sm px-3 py-1.5 rounded-full"
                      >
                        {landmark}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Postcodes */}
              {area.postcodes && area.postcodes.length > 0 && (
                <div className="bg-slate-900 rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-copper" />
                    Postcodes We Cover
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {area.postcodes.map((postcode, index) => (
                      <span
                        key={index}
                        className="inline-block bg-white/10 text-white/90 text-sm px-3 py-1.5 rounded-lg border border-white/10"
                      >
                        {postcode}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nearby Areas */}
          {nearbyAreas.length > 0 && (
            <div>
              <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
                Nearby Areas
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                We Also Serve
              </h2>
              <p className="text-slate-600 mb-8">
                In addition to {area.name}, we provide our expert roofing services to these nearby areas:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {nearbyAreas.map((nearbyArea) => (
                  <Link
                    key={nearbyArea.slug}
                    href={`/${nearbyArea.slug}`}
                    className="group flex items-center gap-3 bg-white rounded-xl p-4 shadow-soft border border-slate-100 hover:border-copper/30 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-copper/10 transition-colors">
                      <MapPin className="w-4 h-4 text-slate-400 group-hover:text-copper transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 group-hover:text-copper transition-colors truncate">
                        {nearbyArea.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{nearbyArea.displayName}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-copper transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-copper hover:text-copper-600 font-semibold group"
              >
                View all areas we serve
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
