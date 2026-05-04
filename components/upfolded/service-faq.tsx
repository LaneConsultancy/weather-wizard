import type { ServiceContent } from "@/lib/content/services";

interface ServiceFaqProps {
  service: ServiceContent;
}

/**
 * FAQ section for service landing pages in the upfolded aesthetic.
 * Uses bg-slate-800 dark background matching the testimonials/trust bar.
 * Renders FAQPage JSON-LD schema for rich results.
 * Renders each FAQ as native <details>/<summary> for accessible accordion behaviour.
 *
 * NOTE: dangerouslySetInnerHTML is used only for the JSON-LD script tag.
 * All content originates from developer-authored services.ts — there is no
 * user input involved. This mirrors the pattern used across all other pages
 * in this codebase (e.g. app/guttering/page.tsx).
 */
export function ServiceFaq({ service }: ServiceFaqProps) {
  // Build FAQPage structured data — static controlled content, not user input
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="bg-slate-900 py-20 md:py-28">
      {/* FAQPage JSON-LD — developer-authored controlled content, safe to serialise */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-copper bg-copper/20 border border-copper/30 rounded-full px-4 py-1.5 mb-5">
              FAQs
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-balance tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {service.faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-white font-semibold text-sm leading-snug select-none hover:bg-white/5 transition-colors">
                  <span>{faq.question}</span>
                  {/* Chevron — rotates on open via group-open Tailwind variant */}
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-copper transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 pt-1">
                  <p className="text-white/80 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
