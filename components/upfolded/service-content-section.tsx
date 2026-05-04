import type { ServiceContent } from "@/lib/content/services";

interface ServiceContentSectionProps {
  service: ServiceContent;
}

/**
 * SEO content section for service landing pages.
 * Renders the service description and features grid in the clean upfolded aesthetic.
 * Uses bg-cream and plain sans-serif — no Cinzel / display font.
 */
export function ServiceContentSection({ service }: ServiceContentSectionProps) {
  // Split the long-form description into paragraphs on double newlines
  const paragraphs = service.description
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-cream">
      {/* Description section */}
      <section className="py-20 md:py-28 border-b border-slate-200/60">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 md:mb-14">
              <span className="inline-block bg-copper-50 text-copper-700 font-semibold text-xs uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
                The detail
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 text-balance tracking-tight">
                About Our {service.name} Service
              </h2>
            </div>
            <div className="space-y-5">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-slate-700 leading-relaxed text-base sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features grid section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
              <span className="inline-block bg-copper-50 text-copper-700 font-semibold text-xs uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
                What&rsquo;s included
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 text-balance tracking-tight">
                Everything covered, nothing extra to chase
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {service.features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft"
                >
                  <h3 className="text-slate-900 font-semibold text-base mb-2 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
