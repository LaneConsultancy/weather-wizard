"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, AlertTriangle } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      title: "Roof Repairs",
      description:
        "Missing tiles, cracked flashing, valley leaks, blown ridge tiles — I've fixed them all. I'll photograph the damage, explain exactly what's wrong, and give you a fixed price before touching anything. Most repairs done same-day.",
      image: "/images/roof-repairs.png",
      features: ["Fixed price upfront", "Same-day repairs", "Photos of damage"],
    },
    {
      title: "Guttering Repairs",
      description:
        "Blocked gutters cause damp walls and foundation problems. I'll clear the debris, check the joints and brackets, and fix any leaks. If sections need replacing, I'll match your existing system — no need to redo the lot.",
      image: "/images/guttering.png",
      features: ["Full inspection", "Leak repairs", "Match existing systems"],
    },
    {
      title: "Chimney Repairs",
      description:
        "Cracked flaunching, loose pots, failing flashing — chimney problems get worse fast. I'll scaffold safely, photograph everything from up top, and give you options. Repointing to full rebuilds, I've done hundreds.",
      image: "/images/chimney.png",
      features: ["Safe access", "Photographic survey", "All repairs covered"],
    },
    {
      title: "Flat Roofing",
      description:
        "Felt roofs fail, that's just what they do. I fit EPDM rubber and GRP fibreglass — materials that'll last 25+ years. I'll strip back properly, check the boards, and give you a roof that won't need touching for decades.",
      image: "/images/flat-roofing.png",
      features: ["EPDM or GRP", "20-year guarantee", "Full deck inspection"],
    },
    {
      title: "Fascias & Soffits",
      description:
        "Rotten fascias let water into your roof space. I fit quality UPVC that won't need painting and lasts for years. I'll check for any hidden damage while I'm up there — better to know now than later.",
      image: "/images/fascias-soffits.png",
      features: ["Quality UPVC", "Hidden damage check", "Clean finish"],
    },
    {
      title: "Emergency Repairs",
      description:
        "Storm damage at 2am? I answer my phone. I'll get to you fast, make it watertight, and arrange proper repairs once the weather clears. Don't let a small leak become a big problem.",
      image: "/images/hero.png",
      features: ["I answer the phone", "Fast response", "Made watertight"],
      isEmergency: true,
    },
  ];

  return (
    <section
      id="services"
      className="relative py-20 md:py-28 bg-slate-900 overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 slate-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
            What I Do
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Roofing Services
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            25 years of fixing Kent roofs. I&apos;ve seen every problem and know how to fix it properly.
            Here&apos;s what I can help you with.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <article
              key={index}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
                service.isEmergency
                  ? "ring-2 ring-rust/50 shadow-lg shadow-rust/20 hover:shadow-xl hover:shadow-rust/30"
                  : "shadow-soft-lg hover:shadow-soft-xl"
              } hover:-translate-y-2`}
            >
              {/* Image with overlay */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading={index < 3 ? "eager" : "lazy"}
                />
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 ${
                    service.isEmergency
                      ? "bg-gradient-to-t from-rust-900/95 via-rust-800/80 to-rust-700/40"
                      : "bg-gradient-to-t from-slate-900/95 via-slate-800/70 to-slate-700/30"
                  }`}
                />

                {/* Emergency badge */}
                {service.isEmergency && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-rust/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    24/7
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className={`p-6 ${
                  service.isEmergency ? "bg-rust-900" : "bg-slate-800"
                }`}
              >
                {/* Title */}
                <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-copper transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="flex flex-wrap gap-2 mb-5">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        service.isEmergency
                          ? "bg-rust-800/50 text-rust-200"
                          : "bg-slate-700/50 text-slate-300"
                      }`}
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full font-semibold transition-all duration-300 ${
                    service.isEmergency
                      ? "bg-white text-rust-700 hover:bg-rust-50 hover:text-rust-800"
                      : "bg-copper hover:bg-copper-500 text-white"
                  }`}
                  asChild
                >
                  <a href="tel:08003162922" className="flex items-center justify-center gap-2">
                    {service.isEmergency ? (
                      <>
                        <Phone className="h-4 w-4" />
                        Call Now
                      </>
                    ) : (
                      <>
                        Learn More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
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
