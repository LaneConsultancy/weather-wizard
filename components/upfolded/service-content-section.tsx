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
      <section className="py-12 md:py-16 border-b border-slate-200/60">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
              About Our {service.name} Service
            </h2>
            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-slate-700 leading-relaxed text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features grid section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
              What&apos;s Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {service.features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-soft"
                >
                  <h3 className="text-slate-900 font-semibold text-sm mb-2">
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
