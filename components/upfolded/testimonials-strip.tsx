import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Polite, respectful, on time, tidy and a good price. They fitted us in for an urgent repair. I would definitely use them again.",
    author: "Verified Reviewer",
  },
  {
    quote:
      "I was beyond pleased with the job done on my roof. They were very professional and very quick at getting the job done. I would recommend them to anyone getting a new roof or a re-roof.",
    author: "Verified Reviewer",
  },
  {
    quote:
      "I had a new roof installed and it went perfect. Kind, considerate, and extremely helpful from start to finish. Would definitely use them again.",
    author: "Verified Reviewer",
  },
];

export function TestimonialsStrip() {
  return (
    <section className="bg-slate-800 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 md:mb-10">
          Rated 10/10 on Checkatrade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white/5 border border-white/10 rounded-xl p-5 md:p-6"
            >
              <Quote className="absolute top-4 right-4 h-6 w-6 text-copper/20" />
              <p className="text-white/90 text-sm leading-relaxed mb-4 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                &mdash; {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
