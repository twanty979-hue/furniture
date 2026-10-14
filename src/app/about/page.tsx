import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'About The Studio — Craft, Philosophy & Joinery | Ember & Ash',
  description: 'Sculpting architectural furniture from honest natural materials. Learn about our heritage joinery, sustainable provenance, and bespoke atelier.',
};

const PILLARS = [
  {
    number: '01',
    title: 'Honest Material Gravity',
    description:
      'We never use synthetic veneers, resin fillers, or composite sawdust boards. Every piece possesses the raw tactile weight and density of solid timber, honed stone, and pure woven fibers.',
  },
  {
    number: '02',
    title: 'Generational Joinery',
    description:
      'Engineered with traditional mortise-and-tenon and interlocking lap joints that accommodate natural wood expansion. Our pieces are crafted to be repaired, refinished, and passed down through generations.',
  },
  {
    number: '03',
    title: 'Architectural Restraint',
    description:
      'We strip away ornament to let geometric proportions and wood grain cathedral lines take center stage. The result is furniture that grounds modern rooms with tranquil, monastic calm.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink">
      <Header dynamic={false} />

      <main className="flex-grow pt-28 md:pt-36">
        {/* Hero Section */}
        <section className="px-6 md:px-20 lg:px-32 xl:px-[180px] pb-16 md:pb-24 border-b border-hairline/60">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-sage" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage">
                Studio & Craftsmanship
              </span>
            </div>
            <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[72px] font-medium leading-[1.05] tracking-tight text-ink max-w-4xl">
              Sculpting Stillness from Raw Earth.
            </h1>
            <p className="font-sans text-[15px] md:text-[18px] text-body/80 font-normal leading-relaxed max-w-2xl mt-6">
              Ember & Ash was founded on an uncompromising principle: that modern furniture should cultivate calm, celebrate tactile honesty, and outlast fleeting disposable trends.
            </p>
          </div>
        </section>

        {/* Narrative & Atelier Photo */}
        <section className="px-6 md:px-20 lg:px-32 xl:px-[180px] py-16 md:py-24 border-b border-hairline/60">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-[11px] font-bold text-sage uppercase tracking-[0.2em] block">
                The Origin
              </span>
              <h2 className="font-serif text-[32px] sm:text-[44px] font-medium leading-[1.1] text-ink">
                Form Follows Quiet.
              </h2>
              <div className="space-y-4 font-sans text-[14px] sm:text-[15px] text-body leading-relaxed">
                <p>
                  In a culture dominated by glossy plastic surfaces and temporary flat-pack convenience, our studio retreats to the ancient weight of solid timber and quarried Roman stone.
                </p>
                <p>
                  Every commission begins with lumber selection. Master woodworkers examine the grain orientation of mature European white oak, orienting growth rings to guarantee structural equilibrium and natural breathing across humid and dry seasons.
                </p>
                <p>
                  We believe true luxury is tactile. It is felt in the silky cool density of unpolished travertine under fingertips, the gentle curve of a hand-planed chair armrest, and the earthy aroma of natural beeswax finish.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-8 border-t border-hairline">
                <div>
                  <span className="font-serif text-[32px] font-medium text-ink block">100%</span>
                  <span className="font-sans text-[11px] uppercase tracking-wider text-muted">FSC Certified Timber</span>
                </div>
                <div>
                  <span className="font-serif text-[32px] font-medium text-ink block">0%</span>
                  <span className="font-sans text-[11px] uppercase tracking-wider text-muted">Toxic VOC Coatings</span>
                </div>
                <div>
                  <span className="font-serif text-[32px] font-medium text-ink block">50+</span>
                  <span className="font-sans text-[11px] uppercase tracking-wider text-muted">Year Design Horizon</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative group overflow-hidden border border-hairline shadow-sm bg-[#ECE7DE]">
                <img
                  src="https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&q=80&w=1200"
                  alt="Joinery Studio Craftsmanship"
                  className="w-full h-[450px] sm:h-[550px] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-canvas/92 backdrop-blur-md p-4 border border-hairline/60">
                  <p className="font-serif italic text-[14px] text-ink">
                    &ldquo;Wood is not an inert manufacturing plastic; it is an organic document of climate, sunlight, and time.&rdquo;
                  </p>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-sage block mt-2">
                    Studio Atelier Notes // Chiang Mai
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Pillars */}
        <section className="px-6 md:px-20 lg:px-32 xl:px-[180px] py-16 md:py-24 border-b border-hairline/60 bg-[#F5EFE6]">
          <div className="max-w-[1600px] mx-auto">
            <div className="max-w-xl mb-16">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage block mb-2">
                Ethos & Integrity
              </span>
              <h2 className="font-serif text-[36px] sm:text-[46px] font-medium text-ink">
                Our Three Commitments.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {PILLARS.map((p) => (
                <div key={p.number} className="p-8 bg-surface border border-hairline shadow-2xs space-y-4">
                  <span className="font-mono text-[14px] font-bold text-sage">
                    {p.number}
                  </span>
                  <h3 className="font-serif text-[22px] font-medium text-ink">
                    {p.title}
                  </h3>
                  <p className="font-sans text-[13.5px] text-body leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bespoke Commissions & Atelier Visit */}
        <section id="contact" className="px-6 md:px-20 lg:px-32 xl:px-[180px] py-16 md:py-24">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage block">
                Bespoke & Trade Appointments
              </span>
              <h2 className="font-serif text-[34px] sm:text-[44px] font-medium text-ink">
                Commission an Architectural Piece.
              </h2>
              <p className="font-sans text-[14px] sm:text-[15px] text-body leading-relaxed max-w-xl">
                We collaborate closely with private collectors, architects, and interior designers to create custom dimensions, specific timber species selections, and bespoke spatial furnishings.
              </p>
              <div className="space-y-3 font-sans text-[13px] text-body/90">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-sage" />
                  <span><strong>Bangkok Gallery & Atelier:</strong> Sukhumvit Creative District</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-sage" />
                  <span><strong>Woodworking Workshop:</strong> San Kamphaeng, Chiang Mai</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-surface border border-hairline p-8 space-y-6 shadow-sm">
              <h3 className="font-serif text-[20px] font-medium text-ink">
                Schedule a Consultation
              </h3>
              <form className="space-y-4 text-[13px]" action="#">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Somchai Prasert"
                    className="w-full bg-[#FAF6EE] border border-hairline px-3 py-2.5 outline-none focus:border-sage"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    className="w-full bg-[#FAF6EE] border border-hairline px-3 py-2.5 outline-none focus:border-sage"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-muted mb-1">
                    Commission Interest
                  </label>
                  <select className="w-full bg-[#FAF6EE] border border-hairline px-3 py-2.5 outline-none focus:border-sage cursor-pointer">
                    <option>Custom Dining Table / Seating</option>
                    <option>Modular Living Space Commission</option>
                    <option>Commercial / Hospitality Project</option>
                    <option>Private Showroom Appointment</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="w-full py-3.5 bg-ink text-canvas hover:bg-sage transition-colors font-sans text-[11px] font-bold uppercase tracking-[0.2em] cursor-pointer"
                >
                  Request Private Appointment
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
