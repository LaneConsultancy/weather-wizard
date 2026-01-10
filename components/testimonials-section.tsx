import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "John D.",
      location: "Maidstone, Kent",
      service: "Roof Repairs",
      rating: 5,
      text: "Excellent service from start to finish. The team fixed our storm-damaged roof quickly and professionally. Highly recommend Weather Wizard!"
    },
    {
      name: "Sarah M.",
      location: "Canterbury, Kent",
      service: "Guttering Installation",
      rating: 5,
      text: "Very impressed with the quality of work. Our new guttering looks fantastic and works perfectly. Fair pricing and friendly service."
    },
    {
      name: "Robert P.",
      location: "Ashford, Kent",
      service: "Chimney Repairs",
      rating: 5,
      text: "These guys really know their stuff. Repaired our old chimney beautifully and explained everything clearly. True professionals."
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-navy-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`${cinzel.className} text-4xl md:text-5xl font-bold text-navy mb-4`}>
            What Our Customers Say
          </h2>
          <p className="text-xl text-navy/70">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-navy/80 mb-6 italic">{testimonial.text}</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-navy">{testimonial.name}</p>
                  <p className="text-sm text-navy/60">{testimonial.location}</p>
                  <p className="text-sm text-gold font-semibold mt-1">{testimonial.service}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
