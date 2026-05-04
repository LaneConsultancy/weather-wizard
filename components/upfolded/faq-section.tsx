/**
 * FaqSection — 10-question FAQ accordion for the consolidated landing page.
 *
 * Uses native <details>/<summary> elements:
 * - No client-side JS required (server component)
 * - Content is pre-rendered and indexable by search engines
 * - Keyboard accessible by default (browser handles focus/Enter/Space)
 *
 * The group-open:rotate-180 Tailwind variant targets the <details> element's
 * open state and rotates the chevron icon accordingly.
 */

import { ChevronDown } from "lucide-react";

interface Faq {
  q: string;
  a: string;
}

const faqs: Faq[] = [
  {
    q: "What roofing services do you cover?",
    a: "Pitched roofs, flat roofs, slate, tile, lead work, guttering, fascias and soffits, chimney repairs, pointing, ridge tiles. If it's a roof, I've fixed it. Bird-proofing and exterior painting too.",
  },
  {
    q: "How quickly can you come out for a quote?",
    a: "Same day or next day in most cases. If you've got an active leak, I'll prioritise. Call me directly on 0800 316 2922 and I'll tell you when I can be there.",
  },
  {
    q: "Do you charge a call-out fee?",
    a: "No. I come out, look at the job, write you a fixed-price quote. No fee, no obligation, no pressure to book.",
  },
  {
    q: "Should I repair or replace my roof?",
    a: "Depends on age, condition, and how widespread the problem is. Small leaks, missing tiles, damaged flashing: almost always a repair. Sagging, multiple slipped tiles across the whole roof, or a roof over 25 years old that's seen a lot of weather: usually time for a replacement. I'll tell you straight when I'm up there.",
  },
  {
    q: "Are you insured?",
    a: "Yes. Full public liability cover for the work and the site. Paperwork available on request before I start the job.",
  },
  {
    q: "What areas of Kent do you cover?",
    a: "Most of Kent. Maidstone, Tunbridge Wells, Canterbury, Ashford, Dartford, Gravesend, Sevenoaks, Tonbridge, Folkestone, Dover, the lot. Half an hour from base to most postcodes. If you're not sure, just ask.",
  },
  {
    q: "How much does a roof repair cost?",
    a: "Genuinely varies. Could be £80 for a single slipped tile, could be £2,500 for a section re-felt. The honest answer is I won't give you a number until I've looked at it. The quote is free and there's no obligation.",
  },
  {
    q: "Do you offer a guarantee?",
    a: "Yes. Written workmanship guarantee on all jobs. If something fails because of how I fitted it, I come back and put it right. Materials carry their manufacturer warranty separately.",
  },
  {
    q: "Can you handle emergency leaks?",
    a: "Yes. Same-day response in most cases. Call 0800 316 2922. That's my mobile, I'll pick up.",
  },
  {
    q: "Do you take card payments?",
    a: "Yes. Card, bank transfer, or cheque if you must. No cash-only nonsense, no funny invoicing. Proper receipt every time.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Section header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="inline-block bg-copper-50 text-copper-700 font-semibold text-xs uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
            FAQs
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5 text-balance tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Most common questions about Kent roofing. Straight answers, no waffle.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-slate-200 rounded-xl bg-white transition-all open:border-copper/30"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer p-5 font-semibold text-slate-900 list-none [&::-webkit-details-marker]:hidden hover:bg-slate-50 rounded-xl">
                <span>{faq.q}</span>
                <ChevronDown
                  className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform flex-shrink-0"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-5 pb-5 text-slate-700 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
