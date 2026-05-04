import type { ServiceContent } from "@/lib/content/services";

interface ServiceHowItWorksProps {
  service: ServiceContent;
}

export function ServiceHowItWorks({ service }: ServiceHowItWorksProps) {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
          <span className="inline-block bg-copper-50 text-copper-700 font-semibold text-xs uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 text-balance tracking-tight">
            From first call to fixed roof
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {service.process.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-copper/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-copper font-bold text-lg">{step.step}</span>
              </div>
              <p className="text-slate-900 font-semibold text-sm">{step.title}</p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
