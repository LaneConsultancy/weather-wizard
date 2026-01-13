"use client";

import { Phone, Camera, FileText, Wrench, Sparkles, Shield } from "lucide-react";

export function TestimonialsSection() {
  const steps = [
    {
      step: "1",
      icon: Phone,
      title: "You Call, I Answer",
      description:
        "No call centres, no voicemail loops. You'll speak to me directly. Tell me what's wrong and I'll give you an honest idea of what to expect.",
    },
    {
      step: "2",
      icon: Camera,
      title: "I Inspect & Photograph",
      description:
        "I'll come out, usually within 48 hours. I'll get up on the roof, take photos of the problem, and show you exactly what's going on.",
    },
    {
      step: "3",
      icon: FileText,
      title: "You Get a Fixed Quote",
      description:
        "A written quote with the price you'll pay — no hidden extras, no surprises. If you don't want to go ahead, no pressure. Simple as that.",
    },
    {
      step: "4",
      icon: Wrench,
      title: "Work Done Properly",
      description:
        "I do the job right the first time. After 25 years, I know what corners not to cut. I'll keep you updated throughout.",
    },
    {
      step: "5",
      icon: Sparkles,
      title: "Site Left Clean",
      description:
        "When I leave, you won't know I've been — except for the fixed roof. All materials cleared, no mess left behind.",
    },
    {
      step: "6",
      icon: Shield,
      title: "Guarantee Provided",
      description:
        "You get a written guarantee on the work. If something goes wrong, I'll put it right. I'm not going anywhere — been here 25 years, plan to stay.",
    },
  ];

  return (
    <section id="how-we-work" className="relative py-20 md:py-28 bg-cream overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-copper/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
            How It Works
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            What to Expect
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            No messing about. Here&apos;s exactly what happens when you get in touch.
            I&apos;ve been doing this 25 years — I know what good service looks like.
          </p>
        </div>

        {/* Process steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100"
              >
                {/* Step number */}
                <div className="absolute top-6 right-6">
                  <span className="text-5xl font-bold text-copper/10">
                    {item.step}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-copper to-copper-600 flex items-center justify-center mb-5 shadow-lg shadow-copper/20 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3 group-hover:text-copper transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>

        {/* Trust summary */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white rounded-2xl px-8 py-5 shadow-soft border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-copper/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-copper" />
              </div>
              <span className="text-slate-700 font-medium">
                Public Liability Insured
              </span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-200" />
            <span className="text-slate-600 text-sm">
              New company, <span className="font-semibold text-slate-900">not</span> new to roofing.
              25 years&apos; experience behind every job.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
