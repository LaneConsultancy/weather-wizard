import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Cinzel } from "next/font/google";
import { Area } from "@/lib/areas";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });

interface AreaServicesProps {
  area: Area;
}

export function AreaServices({ area }: AreaServicesProps) {
  const services = [
    {
      title: "Roof Repairs",
      description: `Expert repairs for all types of roofing issues in ${area.name}. From missing tiles to storm damage, we restore your roof to perfect condition with quality materials and craftsmanship.`,
      image: "/images/roof-repairs.png"
    },
    {
      title: "Guttering Repairs",
      description: `Keep water flowing away from your ${area.name} property with our professional guttering services. We repair, clean, and install guttering systems that protect your home.`,
      image: "/images/guttering.png"
    },
    {
      title: "Chimney Repairs",
      description: `Specialist chimney repairs and maintenance in ${area.name} to keep your home safe and weatherproof. From repointing to complete rebuilds, we handle all chimney work.`,
      image: "/images/chimney.png"
    },
    {
      title: "Flat Roofing",
      description: `Modern flat roofing solutions in ${area.name} using the latest materials and techniques. Durable, long-lasting installations with comprehensive warranties.`,
      image: "/images/flat-roofing.png"
    },
    {
      title: "Fascias & Soffits",
      description: `Pristine fascias and soffits installation and repair in ${area.name}. Protect your roofline with our professional service and high-quality UPVC materials.`,
      image: "/images/fascias-soffits.png"
    },
    {
      title: "Emergency Repairs",
      description: `24/7 emergency roofing service in ${area.name} when you need it most. Storm damage, leaks, or urgent repairs - we respond fast to protect your home.`,
      image: "/images/hero.png"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(26, 46, 66, 0.1) 10px, rgba(26, 46, 66, 0.1) 11px)'}} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`${cinzel.className} text-4xl md:text-5xl font-bold text-navy mb-4`}>
            Our Roofing Services in {area.name}
          </h2>
          <p className="text-xl text-navy/70 max-w-2xl mx-auto">
            Comprehensive roofing solutions for homes across {area.displayName}. From minor repairs to complete installations, we do it all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isEmergency = service.title === "Emergency Repairs";
            return (
              <Card
                key={index}
                className={`overflow-hidden transition-all duration-300 ${
                  isEmergency
                    ? 'ring-2 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:-translate-y-1'
                    : 'shadow-lg hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={service.image}
                    alt={`${service.title} in ${area.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
                <CardHeader>
                  <CardTitle className={`${cinzel.className} text-2xl ${isEmergency ? 'text-red-50' : 'text-white'}`}>
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 mb-4">{service.description}</p>
                  <Button
                    variant="outline"
                    className={`w-full ${
                      isEmergency
                        ? 'border-red-500 text-white bg-red-500/20 hover:bg-red-500 hover:text-white'
                        : 'border-teal text-white hover:bg-teal hover:text-white'
                    }`}
                    asChild
                  >
                    <a href="tel:01622123456">
                      <Phone className="mr-2 h-4 w-4" />
                      {isEmergency ? 'Emergency Call Now' : `Call About ${service.title}`}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
