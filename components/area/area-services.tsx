import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, Clock, ArrowRight } from "lucide-react";
import { Area } from "@/lib/areas";

interface AreaServicesProps {
  area: Area;
}

export function AreaServices({ area }: AreaServicesProps) {
  const services = [
    {
      title: "Roof Repairs",
      description: `Missing tiles, cracked flashing, valley leaks — I've fixed them all across ${area.name}. I'll photograph the damage, explain what's wrong, and give you a fixed price before touching anything.`,
      image: "/images/roof-repairs.webp"
    },
    {
      title: "Guttering Repairs",
      description: `Blocked gutters cause damp walls and foundation problems. I'll clear the debris, check the joints, and fix any leaks at your ${area.name} property. If sections need replacing, I'll match your existing system.`,
      image: "/images/guttering.webp"
    },
    {
      title: "Chimney Repairs",
      description: `Cracked flaunching, loose pots, failing flashing — chimney problems get worse fast. I've repaired hundreds of chimneys across ${area.name}. Repointing to full rebuilds, I've done it all.`,
      image: "/images/chimney.webp"
    },
    {
      title: "Flat Roofing",
      description: `Felt roofs fail — that's just what they do. I fit EPDM rubber and GRP fibreglass in ${area.name} — materials that'll last 25+ years. Proper job, proper guarantee.`,
      image: "/images/flat-roofing.webp"
    },
    {
      title: "Fascias & Soffits",
      description: `Rotten fascias let water into your roof space. I fit quality UPVC that won't need painting. I'll check for any hidden damage while I'm up there — better to know now.`,
      image: "/images/fascias-soffits.webp"
    },
    {
      title: "Emergency Repairs",
      description: `Storm damage at 2am? I answer my phone. I'll get to your ${area.name} property fast, make it watertight, and arrange proper repairs once the weather clears.`,
      image: "/images/hero.webp",
      isEmergency: true
    }
  ];

  return (
    <section id="services" className="relative py-20 md:py-28 bg-cream overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-copper/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
            What I Do
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Roofing Services in {area.name}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            25 years fixing roofs across {area.displayName}. I&apos;ve seen every problem and know how to fix it properly. Here&apos;s what I can help you with.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <article
              key={index}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 border ${
                service.isEmergency
                  ? 'border-rust/30 ring-1 ring-rust/20'
                  : 'border-slate-100'
              }`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={`${service.title} in ${area.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Emergency badge */}
                {service.isEmergency && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-rust text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    24/7
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`font-display text-xl font-bold mb-3 transition-colors duration-300 ${
                  service.isEmergency
                    ? 'text-rust group-hover:text-rust-600'
                    : 'text-slate-900 group-hover:text-copper'
                }`}>
                  {service.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  {service.description}
                </p>

                <Button
                  variant="outline"
                  className={`w-full font-semibold transition-all duration-300 ${
                    service.isEmergency
                      ? 'border-rust/30 text-rust hover:bg-rust hover:text-white hover:border-rust'
                      : 'border-slate-200 text-slate-700 hover:bg-copper hover:text-white hover:border-copper'
                  }`}
                  asChild
                >
                  <a href="tel:08003162922" className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    {service.isEmergency ? "Emergency Call" : "Get Quote"}
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
