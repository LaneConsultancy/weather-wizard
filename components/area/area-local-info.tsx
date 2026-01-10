import Link from "next/link";
import { Area, getNearbyAreas } from "@/lib/areas";
import { MapPin, Navigation } from "lucide-react";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });

interface AreaLocalInfoProps {
  area: Area;
}

export function AreaLocalInfo({ area }: AreaLocalInfoProps) {
  const nearbyAreas = getNearbyAreas(area.slug);

  return (
    <section className="py-16 bg-navy-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Local Information */}
          <div>
            <h2 className={`${cinzel.className} text-3xl md:text-4xl font-bold text-navy mb-6`}>
              Serving {area.displayName}
            </h2>
            <div className="space-y-4 text-navy/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-navy mb-2">Our Service Area</h3>
                  <p>
                    We're proud to serve {area.displayName} and the surrounding areas.
                    Our local knowledge and experience means we understand the specific roofing
                    challenges faced by homes in {area.name}, from weather patterns to local
                    building styles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Navigation className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-navy mb-2">Quick Response Times</h3>
                  <p>
                    Being locally based in Kent means we can respond quickly to your roofing
                    needs in {area.name}. Whether it's an emergency repair or a scheduled
                    maintenance visit, we're never far away.
                  </p>
                </div>
              </div>

              {area.localLandmarks && area.localLandmarks.length > 0 && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-navy/10">
                  <h3 className="font-semibold text-navy mb-2">Landmarks We Serve Near</h3>
                  <ul className="list-disc list-inside space-y-1 text-navy/70">
                    {area.localLandmarks.map((landmark, index) => (
                      <li key={index}>{landmark}</li>
                    ))}
                  </ul>
                </div>
              )}

              {area.postcodes && area.postcodes.length > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-navy/10">
                  <h3 className="font-semibold text-navy mb-2">Postcodes We Cover</h3>
                  <p className="text-navy/70">
                    {area.postcodes.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Nearby Areas */}
          {nearbyAreas.length > 0 && (
            <div>
              <h2 className={`${cinzel.className} text-3xl md:text-4xl font-bold text-navy mb-6`}>
                We Also Serve Nearby Areas
              </h2>
              <p className="text-navy/70 mb-6">
                In addition to {area.name}, we provide our expert roofing services to the following nearby areas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nearbyAreas.map((nearbyArea) => (
                  <Link
                    key={nearbyArea.slug}
                    href={`/${nearbyArea.slug}`}
                    className="block bg-white rounded-lg p-4 border border-navy/10 hover:border-gold hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-navy mb-1">{nearbyArea.name}</h3>
                    <p className="text-sm text-navy/60">{nearbyArea.displayName}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-block text-gold hover:text-gold/80 font-semibold underline"
                >
                  View all areas we serve →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
