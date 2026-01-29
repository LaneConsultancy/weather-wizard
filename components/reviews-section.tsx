"use client";

import { Star, Quote, ExternalLink } from "lucide-react";
import Image from "next/image";

// Real reviews from Checkatrade
const reviews = [
  {
    id: 1,
    name: "Verified Customer",
    location: "TN26",
    date: "June 2025",
    rating: 10,
    title: "New flat roof",
    text: "From start to finish all the guys at Weather Wizard's Roofing were polite, respectful, on time, tidy and a good price. They also fitted us in around other jobs as we needed an urgent repair. They brought more men on the day so it could be done in a day instead of 2 as the weather was terrible. It's hard to find a trustworthy and reliable company especially when you are spending a lot of money, if I ever needed to I would definitely use them again and recommend to others.",
    service: "Flat Roofing",
  },
  {
    id: 2,
    name: "Verified Customer",
    location: "TN23",
    date: "February 2025",
    rating: 10,
    title: "Roofing work",
    text: "I was beyond pleased with the job that Weather Wizard's Roofing and Gutter Repairs did on my roof. They were very professional and very quick at getting the job done. I would recommend them to anyone getting a new roof or getting a re-roof.",
    service: "Roof Repairs",
  },
  {
    id: 3,
    name: "Verified Customer",
    location: "TN23",
    date: "February 2025",
    rating: 10,
    title: "Installation",
    text: "I had a new roof installed, and it went perfect. The people were kind, considerate, caring and extremely helpful, from the initial proposal through the installation, cleanup, and billing. I could not be more grateful for the way everything was handled. I would definitely use Weather Wizard's Roofing and Gutter Repairs again.",
    service: "New Roof",
  },
  {
    id: 4,
    name: "Verified Customer",
    location: "DA1",
    date: "March 2025",
    rating: 10,
    title: "Guttering Repairs",
    text: "The third time using this company will definitely recommend them and we'll be using them again.",
    service: "Guttering",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating / 2 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="relative py-20 md:py-28 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-copper/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-100 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
            Customer Reviews
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real reviews from real customers on Checkatrade
          </p>
        </div>

        {/* Checkatrade Summary Badge */}
        <div className="flex justify-center mb-12">
          <a
            href="https://www.checkatrade.com/trades/nobleroofingandgutterrepairs"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {/* Checkatrade style badge */}
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-white">10</div>
              <div className="text-white/60 text-sm">/10</div>
            </div>

            <div className="w-px h-16 bg-white/20" />

            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="text-white font-semibold">58 Reviews</div>
              <div className="text-white/60 text-sm flex items-center gap-1">
                on Checkatrade
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Individual scores */}
            <div className="hidden md:flex gap-4 ml-4">
              {[
                { label: "Quality", score: 10 },
                { label: "Reliability", score: 10 },
                { label: "Communication", score: 10 },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl font-bold text-copper">{item.score}</div>
                  <div className="text-white/50 text-xs">{item.label}</div>
                </div>
              ))}
            </div>
          </a>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="group relative bg-slate-50 rounded-2xl p-6 md:p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-copper/10" />

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{review.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{review.date}</span>
                    <span>•</span>
                    <span>{review.location}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold text-copper">{review.rating}/10</div>
                  <StarRating rating={review.rating} />
                </div>
              </div>

              {/* Review text */}
              <p className="text-slate-600 leading-relaxed mb-4">
                "{review.text}"
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-copper/10 flex items-center justify-center">
                    <span className="text-copper font-semibold text-sm">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-slate-600">{review.name}</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  {review.service}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <a
            href="https://www.checkatrade.com/trades/nobleroofingandgutterrepairs/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-copper hover:text-copper-600 font-semibold transition-colors"
          >
            View all 58 reviews on Checkatrade
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Compact Checkatrade badge for use in hero/form areas
export function CheckatradeBadge({ variant = "default" }: { variant?: "default" | "compact" | "dark" }) {
  const isDark = variant === "dark";
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <a
        href="https://www.checkatrade.com/trades/nobleroofingandgutterrepairs"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 group"
      >
        <div className="flex -space-x-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <span className={`text-sm ${isDark ? "text-white/80" : "text-slate-600"}`}>
          <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>10/10</span>
          {" "}on Checkatrade
        </span>
        <ExternalLink className={`w-3 h-3 ${isDark ? "text-white/50" : "text-slate-400"} group-hover:translate-x-0.5 transition-transform`} />
      </a>
    );
  }

  return (
    <a
      href="https://www.checkatrade.com/trades/nobleroofingandgutterrepairs"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg transition-all group ${
        isDark
          ? "bg-white/10 hover:bg-white/15 border border-white/20"
          : "bg-slate-100 hover:bg-slate-200 border border-slate-200"
      }`}
    >
      <div className="flex -space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <div>
        <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
          10/10 on Checkatrade
        </div>
        <div className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>
          58 verified reviews
        </div>
      </div>
      <ExternalLink className={`w-4 h-4 ${isDark ? "text-white/50" : "text-slate-400"} group-hover:translate-x-0.5 transition-transform`} />
    </a>
  );
}
