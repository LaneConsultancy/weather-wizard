import { Check } from "lucide-react";

const promises = [
  {
    heading: "Workmanship Guarantee",
    body: "Every job carries a written workmanship guarantee. If anything fails because of how I fitted it, I come back and fix it. No quibble.",
  },
  {
    heading: "Fully Insured",
    body: "Full public liability cover for the work and the site. Paperwork available on request, just ask before I start.",
  },
  {
    heading: "Written Quotes, No Hidden Extras",
    body: "You get a written quote before any work starts. The price you agree is the price you pay. No surprises halfway through.",
  },
  {
    heading: "Aftercare On Tap",
    body: "Need me back six months later? Same number, same person, same straightforward conversation. The relationship doesn't end when I pack up the van.",
  },
];

export function GuaranteesSection() {
  return (
    <section className="bg-slate-900 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-copper bg-copper/20 border border-copper/30 rounded-full px-4 py-1.5 mb-5">
              Our promise
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 text-balance tracking-tight">
              Guarantees &amp; Peace of Mind
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Booking a roofer can feel like a gamble. Here is exactly what you
              are covered by when you choose Weather Wizard.
            </p>
          </div>

          {/* Promise grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {promises.map(({ heading, body }) => (
              <div
                key={heading}
                className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-6"
              >
                {/* Copper tick */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-copper/20 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Check className="h-5 w-5 text-copper" />
                </div>

                {/* Copy */}
                <div>
                  <h3 className="text-white font-semibold text-base mb-1">
                    {heading}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#quote-form"
              className="inline-flex items-center gap-2 bg-[#c2410c] hover:bg-[#c2410c]/90 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-copper transition-all"
            >
              Get Your Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
