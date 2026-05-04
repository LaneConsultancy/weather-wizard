interface FinalCtaProps {
  locationName?: string;
}

export function FinalCta({ locationName = "Kent" }: FinalCtaProps) {
  return (
    <section className="bg-slate-900 py-20 md:py-28">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 text-balance tracking-tight">
          No Obligation. No Call-Out Fee. No Surprises.
        </h2>
        <p className="text-white/70 text-lg mb-10 leading-relaxed">
          Get a free quote for your {locationName} roof and I&apos;ll tell you
          exactly what needs doing, and what doesn&apos;t. If it can wait,
          I&apos;ll say so.
        </p>
        <a
          href="#quote-form"
          className="inline-flex items-center gap-2 bg-[#c2410c] hover:bg-[#c2410c]/90 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-copper transition-all btn-shine"
        >
          Get Your Free Quote
        </a>
      </div>
    </section>
  );
}
