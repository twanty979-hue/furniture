import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'The Journal — Design, Materiality & Mindful Living | Ember & Ash',
  description: 'Editorial essays on architectural spaces, craftsmanship traditions, solid timber provenance, and tactile living.',
};

const ARTICLES = [
  {
    id: 'acoustic-timber',
    issue: 'ISSUE // 04',
    category: 'Architecture & Sound',
    date: 'October 12, 2026',
    readTime: '6 min read',
    title: 'The Weight of Quiet Spaces: Why Heavy Solid Oak Changes the Acoustic of a Room.',
    subtitle:
      'Hard glass and bare concrete bounce noise ruthlessly. Dense, unveneered European oak absorbs high frequencies, transforming an echoing room into an auditory sanctuary.',
    image: 'https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1783658884219-216.webp',
    author: 'Elena Thorne',
    authorRole: 'Architectural Acoustic Fellow',
  },
  {
    id: 'travertine-veins',
    issue: 'ISSUE // 03',
    category: 'Material Exploration',
    date: 'September 28, 2026',
    readTime: '4 min read',
    title: 'Unadorned Stone: Embracing the Prehistoric Fissures of Roman Travertine.',
    subtitle:
      'Why we resist synthetic resin fillers, allowing millions of years of subterranean volcanic gas chambers to remain open to sight and touch.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    author: 'Marcus Vance',
    authorRole: 'Master Stonemason',
  },
  {
    id: 'bouclé-warmth',
    issue: 'ISSUE // 02',
    category: 'Textile Tactility',
    date: 'September 14, 2026',
    readTime: '5 min read',
    title: 'Sensory Antidotes: The Cultural Return to Heavy Textured Bouclé and Virgin Wool.',
    subtitle:
      'As modern work hours become saturated with smooth digital glass screens, domestic interiors demand deep, irregular, nubby tactile textures to feel grounded.',
    image: 'https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1783658898381-674.webp',
    author: 'Clara Lin',
    authorRole: 'Textile Historian',
  },
  {
    id: 'mortise-tenon',
    issue: 'ISSUE // 01',
    category: 'Craftsmanship Heritage',
    date: 'August 30, 2026',
    readTime: '7 min read',
    title: 'Behind the Chisel: Why Traditional Mortise and Tenon Joints Outlive Metal Fasteners.',
    subtitle:
      'Screws force static rigidity into dynamic fibers; wood-on-wood joinery breathes, expands, and self-stabilizes through changing monsoon humidity.',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&q=80&w=800',
    author: 'Kaelen Thorne',
    authorRole: 'Lead Joinery Artisan',
  },
];

export default function JournalPage() {
  const [featured, ...restArticles] = ARTICLES;

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink">
      <Header dynamic={false} />

      <main className="flex-grow pt-28 md:pt-36">
        {/* Header Title */}
        <section className="px-6 md:px-20 lg:px-32 xl:px-[180px] pb-12 md:pb-16 border-b border-hairline/60">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-sage" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage">
                Editorial Dispatch
              </span>
            </div>
            <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[72px] font-medium leading-[1.05] tracking-tight text-ink max-w-4xl">
              The Journal: Living with Intention.
            </h1>
            <p className="font-sans text-[15px] md:text-[17px] text-body/80 font-normal leading-relaxed max-w-2xl mt-6">
              Reflections on architectural proportion, natural material provenance, the acoustic dignity of solid wood, and the art of slowing down.
            </p>
          </div>
        </section>

        {/* Lead Featured Article */}
        <section className="px-6 md:px-20 lg:px-32 xl:px-[180px] py-16 md:py-20 border-b border-hairline/60">
          <div className="max-w-[1600px] mx-auto">
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-7">
                <div className="relative group overflow-hidden border border-hairline bg-[#ECE7DE]">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 bg-canvas/92 backdrop-blur-md px-3.5 py-1.5 border border-hairline/60">
                    <span className="font-mono text-[11px] font-semibold text-sage uppercase tracking-wider">
                      {featured.issue}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-4 text-[11px] font-sans uppercase tracking-[0.18em] text-sage font-bold">
                  <span>{featured.category}</span>
                  <span>•</span>
                  <span>{featured.readTime}</span>
                </div>

                <h2 className="font-serif text-[32px] sm:text-[42px] font-medium leading-[1.1] text-ink hover:text-sage transition-colors cursor-pointer">
                  {featured.title}
                </h2>

                <p className="font-sans text-[14px] sm:text-[15px] text-body leading-relaxed">
                  {featured.subtitle}
                </p>

                <div className="pt-4 border-t border-hairline flex items-center justify-between">
                  <div>
                    <span className="font-sans text-[12px] font-semibold text-ink block">
                      {featured.author}
                    </span>
                    <span className="font-sans text-[11px] text-muted">
                      {featured.authorRole}
                    </span>
                  </div>
                  <span className="font-sans text-[11px] text-muted uppercase tracking-wider">
                    {featured.date}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Article Grid */}
        <section className="px-6 md:px-20 lg:px-32 xl:px-[180px] py-16 md:py-24">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-12">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-sage block mb-2">
                Recent Dispatches
              </span>
              <h3 className="font-serif text-[28px] sm:text-[36px] font-medium text-ink">
                Archive of Thought & Material
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
              {restArticles.map((art) => (
                <article key={art.id} className="group space-y-5 cursor-pointer">
                  <div className="relative overflow-hidden border border-hairline bg-[#ECE7DE]">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-[280px] sm:h-[320px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-canvas/90 backdrop-blur-md px-3 py-1 border border-hairline/60">
                      <span className="font-mono text-[10px] font-semibold text-sage">
                        {art.issue}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-sans uppercase tracking-[0.15em] text-sage font-bold">
                      <span>{art.category}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h4 className="font-serif text-[20px] sm:text-[22px] font-medium leading-[1.25] text-ink group-hover:text-sage transition-colors">
                      {art.title}
                    </h4>

                    <p className="font-sans text-[13px] text-body/90 leading-relaxed line-clamp-3">
                      {art.subtitle}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-muted border-t border-hairline/60">
                      <span>{art.author}</span>
                      <span>{art.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
