export function HowItWorksStrip() {
  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8 md:mb-10">
          From First Call to Fixed Roof
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-copper/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-copper font-bold text-lg">1</span>
            </div>
            <p className="text-slate-900 font-semibold text-sm">Tell me the problem</p>
            <p className="text-slate-500 text-xs mt-1">Fill in the quick form below</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-copper/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-copper font-bold text-lg">2</span>
            </div>
            <p className="text-slate-900 font-semibold text-sm">I&apos;ll call you back</p>
            <p className="text-slate-500 text-xs mt-1">Within 2 hours, personally</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-copper/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-copper font-bold text-lg">3</span>
            </div>
            <p className="text-slate-900 font-semibold text-sm">Get a fixed price</p>
            <p className="text-slate-500 text-xs mt-1">No surprises, no hidden costs</p>
          </div>
        </div>
      </div>
    </section>
  );
}
