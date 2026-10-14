import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Material Provenance & Tactile Truth | Ember & Ash',
  description: 'Honoring raw European oak, Roman travertine, and textured tactile fabrics. Discover the origins and care of our materials.',
};

const MATERIALS_CATALOG = [
  {
    id: 'timber',
    name: 'Solid European White Oak & Ash',
    origin: 'FSC-Certified Temperate European Forests',
    finish: 'Organic Bio-Hardwax Oil (Zero VOC)',
    subtitle: 'The grounding gravity of honest slow-grown timber.',
    description:
      'We harvest only mature, certified European white oak and white ash. Left unveneered with full-depth planks, each tabletop reveals natural growth rings, medullary ray flecks, and cathedral grain lines that shift under changing daylight.',
    image: 'https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1783658884219-216.webp',
    attributes: [
      { label: 'Density', val: '720 kg/m³' },
      { label: 'Moisture Stability', val: 'Kiln dried 8-10%' },
      { label: 'Surface Feel', val: 'Open-pore, silk matte' },
      { label: 'Patina Lifespan', val: 'Darkens gracefully over decades' },
    ],
    filterUrl: '/collections2?material=Solid+Wood#catalog',
  },
  {
    id: 'travertine',
    name: 'Roman Travertine & Natural Marble',
    origin: 'Tivoli & Carrara Mountain Basins, Italy',
    finish: 'Silky Hand-Honed Unfilled Matte',
    subtitle: 'Thousands of years of subterranean history frozen in stone.',
    description:
      'Rather than filling the natural cavernous pores with industrial resin, we honor the geological cavities formed by mineral thermal springs. Monolithic table slabs are hand-honed to a tactile satin touch that remains cool under palm pressure.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    attributes: [
      { label: 'Origin Quarry', val: 'Tivoli Sub-Apennine' },
      { label: 'Porosity Grade', val: 'Natural Unfilled Cavity' },
      { label: 'Weight & Presence', val: 'Massive monolithic blocks' },
      { label: 'Thermal Profile', val: 'Cool conduction to touch' },
    ],
    filterUrl: '/collections2?group=Table#catalog',
  },
  {
    id: 'fabrics',
    name: 'Tactile Heavy Bouclé & Belgian Linen',
    origin: 'Heritage Weaving Mills, Flanders & Northern Italy',
    finish: 'Uncoated High-Grammage Natural Fibers',
    subtitle: 'Sensory acoustic warmth designed against digital fatigue.',
    description:
      'Woven with thick irregular looped woolen yarns, our bouclé offers a three-dimensional cloud-like tactile texture that diffuses harsh room echoes. Paired with stonewashed Belgian flax linen that softens naturally with use.',
    image: 'https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1783658898381-674.webp',
    attributes: [
      { label: 'Martindale Rubs', val: '50,000+ Contract Grade' },
      { label: 'Fiber Composition', val: 'Virgin Wool / Natural Flax' },
      { label: 'Acoustic Property', val: 'Sound Absorption Class A' },
      { label: 'Hand Feel', val: 'Deep nubby looped softness' },
    ],
    filterUrl: '/collections2?material=Bouclé+Fabric#catalog',
  },
  {
    id: 'leather',
    name: 'Vegetable-Tanned Saddle Leather',
    origin: 'Tuscan Heritage Tanneries, Italy',
    finish: 'Full-Grain, Aniline Drum Dyed',
    subtitle: 'A living surface that memorizes human contact.',
    description:
      'Tanned slowly over 60 days using natural chestnut and mimosa bark tannins. No synthetic topcoats or polyurethane pigments are applied. The leather breathes, absorbs natural oils, and develops a lustrous golden-honey patina over years.',
    image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&q=80&w=1200',
    attributes: [
      { label: 'Tannin Source', val: 'Chestnut & Mimosa Bark' },
      { label: 'Thickness', val: '2.8 - 3.2 mm Saddle Hide' },
      { label: 'Chemical Additives', val: '0% Chromium Salts' },
      { label: 'Patina Evolution', val: 'Deepens with ambient light' },
    ],
    filterUrl: '/collections2?material=Leather#catalog',
  },
];

const CARE_GUIDES = [
  {
    title: 'Solid Timber Care',
    instructions: [
      'Dust weekly with a dry, lint-free microfiber cloth along the direction of the wood grain.',
      'Wipe liquid spills immediately with a damp lukewarm cloth. Avoid abrasive chemical solvents or ammonia cleaners.',
      'Re-apply natural hardwax oil or beeswax balm once every 12 to 18 months to replenish wood moisture.',
    ],
  },
  {
    title: 'Honed Travertine Care',
    instructions: [
      'Clean daily using a neutral pH stone cleaner or warm distilled water.',
      'Always utilize drink coasters and felt pads under metallic objects to prevent acidic etch marks.',
      'Re-seal porous travertine surfaces semi-annually using a penetrating, breathable natural stone impregnator.',
    ],
  },
  {
    title: 'Bouclé & Linen Care',
    instructions: [
      'Vacuum monthly using a soft brush attachment on low suction to dislodge micro-dust from loop crevices.',
      'For spot spills, dab immediately with an uncolored absorbent towel—do not rub or scrub violently.',
      'Professional gentle dry cleaning is recommended for removable upholstery slipcovers.',
    ],
  },
];

export default function MaterialsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink">
      <Header dynamic={false} />

      <main className="flex-grow pt-28 md:pt-36">
        {/* Page Hero */}
        <section className="px-6 md:px-20 lg:px-32 xl:px-[180px] pb-16 md:pb-24 border-b border-hairline/60">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-sage" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage">
                Material Authenticity
              </span>
            </div>
            <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[72px] font-medium leading-[1.05] tracking-tight text-ink max-w-4xl">
              Honest Provenance & Tactile Truth.
            </h1>
            <p className="font-sans text-[15px] md:text-[17px] text-body/80 font-normal leading-relaxed max-w-2xl mt-6">
              We reject synthetic laminates and disposable plastic coatings. Every piece of furniture is an honest celebration of solid timber rings, unpolished Roman stone pores, and hand-loomed textiles.
            </p>
          </div>
        </section>

        {/* Materials Grid / Detail */}
        <section className="px-6 md:px-20 lg:px-32 xl:px-[180px] py-16 md:py-24 space-y-24 md:space-y-36">
          <div className="max-w-[1600px] mx-auto space-y-24 md:space-y-36">
            {MATERIALS_CATALOG.map((mat, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={mat.id}
                  id={mat.id}
                  className="scroll-mt-36 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
                >
                  {/* Photo */}
                  <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative group overflow-hidden border border-hairline bg-[#ECE7DE]">
                      <img
                        src={mat.image}
                        alt={mat.name}
                        className="w-full h-[380px] sm:h-[480px] md:h-[560px] object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute top-6 left-6 bg-canvas/90 backdrop-blur-md px-3.5 py-1.5 border border-hairline/60">
                        <span className="font-mono text-[11px] font-semibold text-sage uppercase tracking-wider">
                          SPEC // MAT-0{idx + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Copy & Technical Attributes */}
                  <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                    <div className="space-y-2">
                      <span className="font-mono text-[11px] font-bold text-sage tracking-[0.2em] uppercase block">
                        Origin: {mat.origin}
                      </span>
                      <h2 className="font-serif text-[32px] sm:text-[40px] font-medium leading-[1.1] text-ink">
                        {mat.name}
                      </h2>
                      <p className="font-serif italic text-[16px] text-[#7A7568]">
                        &ldquo;{mat.subtitle}&rdquo;
                      </p>
                    </div>

                    <p className="font-sans text-[14px] sm:text-[15px] text-body leading-relaxed">
                      {mat.description}
                    </p>

                    {/* Spec Table */}
                    <div className="border-t border-b border-hairline/70 py-4 grid grid-cols-2 gap-4">
                      {mat.attributes.map((attr) => (
                        <div key={attr.label}>
                          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-muted block">
                            {attr.label}
                          </span>
                          <span className="font-sans text-[12px] font-medium text-ink mt-0.5 block">
                            {attr.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center gap-4">
                      <Link
                        href={mat.filterUrl}
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-ink text-canvas hover:bg-sage transition-colors font-sans text-[11px] font-bold uppercase tracking-[0.2em]"
                      >
                        <span>View {mat.name.split(' ')[0]} Furniture</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Care & Maintenance Section */}
        <section id="care" className="px-6 md:px-20 lg:px-32 xl:px-[180px] py-16 md:py-24 bg-[#F5EFE6] border-t border-hairline">
          <div className="max-w-[1600px] mx-auto">
            <div className="max-w-2xl mb-12">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage block mb-2">
                Preservation Etiquette
              </span>
              <h2 className="font-serif text-[34px] sm:text-[44px] font-medium text-ink">
                Care for Generations.
              </h2>
              <p className="font-sans text-[14px] text-body/80 mt-3 leading-relaxed">
                Natural materials do not wear out; they wear in. Adhere to our simple preservation practices to ensure your pieces develop a rich, luminous patina.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CARE_GUIDES.map((guide) => (
                <div key={guide.title} className="p-8 bg-surface border border-hairline shadow-2xs space-y-4">
                  <h3 className="font-serif text-[20px] font-medium text-ink">
                    {guide.title}
                  </h3>
                  <ul className="space-y-3">
                    {guide.instructions.map((ins, i) => (
                      <li key={i} className="flex items-start gap-3 text-[13px] font-sans text-body leading-relaxed">
                        <span className="text-sage font-mono text-[11px] font-bold shrink-0 mt-0.5">
                          0{i + 1}.
                        </span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
