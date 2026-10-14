import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Spatial Curation — Rooms & Living Spaces | Ember & Ash',
  description: 'Curated architectural environments designed for quiet pause, warmth, and enduring tactile comfort.',
};

const ROOM_CURATIONS = [
  {
    id: 'living',
    number: '01',
    title: 'The Living Space',
    subtitle: 'Sanctuary for congregation, conversation, and quiet pause.',
    description:
      'Proportioned with low horizontal gravity to ground high-ceilinged modern rooms. Sculptural monolithic lounge chairs dialogue with modular linen seating and raw unfilled Roman travertine tables.',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=1200',
    piecesCount: 24,
    materials: ['Solid European Oak', 'Honed Travertine', 'Chunky Bouclé'],
    featuredPieces: [
      { name: 'Modular Sofa System', category: 'Modular & Sofa', link: '/collections2?group=Modular+Sofa#catalog' },
      { name: 'Sculpted Lounge Chair', category: 'Lounge Chair', link: '/collections2?group=Lounge+Chair#catalog' },
      { name: 'Monolithic Coffee Table', category: 'Coffee Table', link: '/collections2?group=Coffee+Table#catalog' },
      { name: 'Solid Timber Side Table', category: 'Side Table', link: '/collections2?group=Side+Table#catalog' },
    ],
    catalogLink: '/collections2?group=Sofa#catalog',
  },
  {
    id: 'dining',
    number: '02',
    title: 'The Dining Sanctuary',
    subtitle: 'Where honest timber joinery anchors daily gathering and ritual.',
    description:
      'Substantial timber tops supported by sculptural cylindrical trestles. Designed to age with every meal, accumulating a deep natural patina of memory and touch.',
    image: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&q=80&w=1200',
    piecesCount: 18,
    materials: ['FSC Solid White Ash', 'Saddle Leather', 'Brushed Brass'],
    featuredPieces: [
      { name: 'Trestle Dining Table', category: 'Dining Table', link: '/collections2?group=Dining+Table#catalog' },
      { name: 'Ergonomic Dining Chair', category: 'Dining Chair', link: '/collections2?group=Dining+Chair#catalog' },
      { name: 'Architectural Bar Stool', category: 'Bar stool', link: '/collections2?group=Bar+stool#catalog' },
      { name: 'Minimalist Sideboard', category: 'Cabinet & More', link: '/collections2?group=Cabinet+%26+More#catalog' },
    ],
    catalogLink: '/collections2?group=Dining+Table#catalog',
  },
  {
    id: 'bedroom',
    number: '03',
    title: 'The Bed Chamber',
    subtitle: 'Tactile stillness and grounded geometry for restorative rest.',
    description:
      'Floating joinery frames that visually hover over the flooring. Unadorned headboards crafted from bookmatched timber planks paired with soft Belgian stone-washed textiles.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200',
    piecesCount: 14,
    materials: ['Smoked Oak', 'Belgian Flax Linen', 'Muted Wool'],
    featuredPieces: [
      { name: 'Low Profile Bedframe', category: 'Bed collection', link: '/collections2?group=Bed+collection#catalog' },
      { name: 'Floating Night Table', category: 'Night Table', link: '/collections2?group=Night+Table#catalog' },
      { name: 'Upholstered End Bench', category: 'Stool & Ottoman', link: '/collections2?group=Stool+%26+Ottoman#catalog' },
      { name: 'Linen Screen / Rack', category: 'Accessories', link: '/collections2?group=Accessories#catalog' },
    ],
    catalogLink: '/collections2?group=Bed+collection#catalog',
  },
  {
    id: 'workspace',
    number: '04',
    title: 'The Study & Atelier',
    subtitle: 'Quiet architecture tailored for contemplation, focus, and craft.',
    description:
      'Surfaces with tactile depth where fingers rest on cool oiled timber. Integrated cable apertures hidden within traditional blind lap joints, blending digital utility with analog stillness.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1200',
    piecesCount: 16,
    materials: ['Natural White Oak', 'Blackened Steel', 'Vegetable Tanned Leather'],
    featuredPieces: [
      { name: 'Executive Working Desk', category: 'Working Desk', link: '/collections2?group=Working+Desk#catalog' },
      { name: 'Contoured Armchair', category: 'Arm chair', link: '/collections2?group=Arm+chair#catalog' },
      { name: 'Modular Book Shelf', category: 'Shelf', link: '/collections2?group=Shelf#catalog' },
      { name: 'Desk Pedestal & Storage', category: 'Dressing & Working', link: '/collections2?group=Dressing+%26+Working#catalog' },
    ],
    catalogLink: '/collections2?group=Working+Desk#catalog',
  },
  {
    id: 'terrace',
    number: '05',
    title: 'The Veranda & Accents',
    subtitle: 'Transitional zones merging architectural shelter with raw open light.',
    description:
      'Sturdy stools, sculptural coat racks, and versatile occasional pieces that travel effortlessly between indoor living and covered sheltered terraces.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200',
    piecesCount: 12,
    materials: ['Weathered Teak', 'Honest Granite', 'Organic Cotton Cord'],
    featuredPieces: [
      { name: 'Sculpted Solid Stool', category: 'Stool & Ottoman', link: '/collections2?group=Stool+%26+Ottoman#catalog' },
      { name: 'Architectural Clothes Rack', category: 'Accessories', link: '/collections2?group=Accessories#catalog' },
      { name: 'Pedestal Accent Stand', category: 'Side Table', link: '/collections2?group=Side+Table#catalog' },
    ],
    catalogLink: '/collections2?group=Accessories#catalog',
  },
];

export default function RoomsPage() {
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
                Spatial Environments
              </span>
            </div>
            <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[72px] font-medium leading-[1.05] tracking-tight text-ink max-w-4xl">
              Curated Rooms for Calm Living.
            </h1>
            <p className="font-sans text-[15px] md:text-[17px] text-body/80 font-normal leading-relaxed max-w-2xl mt-6">
              Each space is conceived as a harmonious dialogue between solid timber gravity, tactile stone warmth, and natural light. Explore our furniture curated by living space.
            </p>

            {/* Quick Room Anchor Jumps */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-10">
              {ROOM_CURATIONS.map((room) => (
                <a
                  key={room.id}
                  href={`#${room.id}`}
                  className="px-4 py-2 bg-surface border border-hairline hover:border-sage text-[11px] font-sans uppercase tracking-[0.15em] font-semibold text-ink/80 hover:text-sage transition-all rounded-full"
                >
                  {room.number}. {room.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Room Editorial Showcase */}
        <section className="px-6 md:px-20 lg:px-32 xl:px-[180px] py-16 md:py-24 space-y-24 md:space-y-36">
          <div className="max-w-[1600px] mx-auto space-y-28 md:space-y-40">
            {ROOM_CURATIONS.map((room, index) => {
              const isEven = index % 2 === 1;
              return (
                <article
                  key={room.id}
                  id={room.id}
                  className="scroll-mt-36 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
                >
                  {/* Image Column */}
                  <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative group overflow-hidden bg-[#ECE7DE] rounded-none border border-hairline/80 shadow-sm">
                      <img
                        src={room.image}
                        alt={room.title}
                        className="w-full h-[400px] sm:h-[520px] md:h-[620px] object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-6 left-6 bg-canvas/90 backdrop-blur-md px-3.5 py-1.5 border border-hairline/60">
                        <span className="font-mono text-[11px] font-semibold tracking-wider text-sage">
                          ENV // {room.number}
                        </span>
                      </div>
                      <div className="absolute bottom-6 right-6 bg-canvas/90 backdrop-blur-md px-4 py-2 border border-hairline/60 font-sans text-[11px] uppercase tracking-[0.15em] font-semibold text-ink">
                        {room.piecesCount} Curated Pieces
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
                    <div className="space-y-2">
                      <span className="font-mono text-[12px] font-bold text-sage tracking-[0.2em] uppercase block">
                        Space Spec 0{index + 1}
                      </span>
                      <h2 className="font-serif text-[32px] sm:text-[42px] font-medium leading-[1.1] text-ink">
                        {room.title}
                      </h2>
                      <p className="font-serif italic text-[16px] text-[#7A7568] leading-relaxed">
                        &ldquo;{room.subtitle}&rdquo;
                      </p>
                    </div>

                    <p className="font-sans text-[14px] sm:text-[15px] text-body leading-relaxed">
                      {room.description}
                    </p>

                    {/* Materials Tag List */}
                    <div className="pt-2 border-t border-hairline/60">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-muted block mb-2.5">
                        Primary Materiality
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {room.materials.map((m) => (
                          <span
                            key={m}
                            className="text-[11px] font-sans px-2.5 py-1 bg-[#F3EDE2] text-body border border-hairline/60"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Furniture Pieces */}
                    <div className="pt-2 border-t border-hairline/60">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-muted block mb-3">
                        Anchoring Pieces
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[12px]">
                        {room.featuredPieces.map((piece) => (
                          <Link
                            key={piece.name}
                            href={piece.link}
                            className="group/piece flex items-center justify-between p-2.5 bg-surface hover:bg-[#F3EDE2] border border-hairline transition-colors"
                          >
                            <span className="font-sans font-medium text-ink group-hover/piece:text-sage truncate">
                              {piece.name}
                            </span>
                            <span className="text-sage opacity-0 group-hover/piece:opacity-100 transition-opacity ml-1">
                              &rarr;
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Primary Button */}
                    <div className="pt-4">
                      <Link
                        href={room.catalogLink}
                        className="inline-flex items-center gap-3 px-6 py-3.5 bg-ink text-canvas hover:bg-sage transition-all duration-300 font-sans text-[11px] font-bold uppercase tracking-[0.2em]"
                      >
                        <span>Explore {room.title} Catalog</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
