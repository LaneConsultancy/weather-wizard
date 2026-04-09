import type { ServiceContent } from "@/lib/content/services";

interface ServiceHowItWorksProps {
  service: ServiceContent;
}

export function ServiceHowItWorks({ service }: ServiceHowItWorksProps) {
  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8 md:mb-10">
          How It Works
        </h2>
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
