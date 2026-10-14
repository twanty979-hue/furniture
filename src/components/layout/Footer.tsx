import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#171614] text-[#EFEBE4] border-t border-[#2A2824] pt-20 pb-12 px-6 md:px-20 lg:px-32 xl:px-[180px]">
      <div className="max-w-[1600px] mx-auto">
        {/* Top section: Brand statement & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-[#2A2824]">
          <div className="lg:col-span-6 space-y-6">
            <Link href="/" className="inline-block">
              <img
                src="/image-Photoroom.png"
                alt="Ember & Ash Logo"
                className="h-14 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="font-serif text-[18px] md:text-[22px] font-normal leading-relaxed text-[#DFD9CD] max-w-xl">
              Architectural furniture sculpted from raw, honest natural materials. Crafted to anchor mindful modern spaces with quiet poise and timeless permanence.
            </p>
            <div className="flex items-center gap-6 text-[11px] font-sans uppercase tracking-[0.2em] text-[#A69F91]">
              <span>FSC Certified Timber</span>
              <span>•</span>
              <span>Roman Travertine</span>
              <span>•</span>
              <span>Handcrafted Joinery</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#AC9368] block">
                The Quiet Dispatch
              </span>
              <p className="font-sans text-[13px] text-[#A69F91] leading-relaxed max-w-md">
                Receive private notices on seasonal exhibitions, limited edition material releases, and editorial essays on architectural living.
              </p>
              <div className="flex items-center border-b border-[#403C35] focus-within:border-[#AC9368] transition-colors pb-2 pt-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address…"
                  className="w-full bg-transparent border-none text-[13px] text-[#FFFAF1] outline-none placeholder:text-[#686358]"
                />
                <button
                  type="button"
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#AC9368] hover:text-[#FFFAF1] transition-colors shrink-0 ml-4 cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div className="pt-8 text-[12px] text-[#7A7568]">
              Private consultations available by appointment at our Bangkok & Chiang Mai ateliers.
            </div>
          </div>
        </div>

        {/* Middle section: Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-[#2A2824] text-[12px]">
          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#AC9368] mb-5">
              Exhibition
            </h4>
            <ul className="space-y-3 font-sans text-[#A69F91]">
              <li>
                <Link href="/collections2#catalog" className="hover:text-[#FFFAF1] transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/collections2?group=Sofa#catalog" className="hover:text-[#FFFAF1] transition-colors">
                  Modular & Sofas
                </Link>
              </li>
              <li>
                <Link href="/collections2?group=Chair#catalog" className="hover:text-[#FFFAF1] transition-colors">
                  Lounge & Dining Chairs
                </Link>
              </li>
              <li>
                <Link href="/collections2?group=Table#catalog" className="hover:text-[#FFFAF1] transition-colors">
                  Solid Timber & Stone Tables
                </Link>
              </li>
              <li>
                <Link href="/collections2?group=Accessories#catalog" className="hover:text-[#FFFAF1] transition-colors">
                  Accents & Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#AC9368] mb-5">
              Spatial Curation
            </h4>
            <ul className="space-y-3 font-sans text-[#A69F91]">
              <li>
                <Link href="/rooms" className="hover:text-[#FFFAF1] transition-colors">
                  The Living Space
                </Link>
              </li>
              <li>
                <Link href="/rooms#dining" className="hover:text-[#FFFAF1] transition-colors">
                  The Dining Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/rooms#bedroom" className="hover:text-[#FFFAF1] transition-colors">
                  The Bedroom Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/rooms#workspace" className="hover:text-[#FFFAF1] transition-colors">
                  The Study & Atelier
                </Link>
              </li>
              <li>
                <Link href="/rooms#terrace" className="hover:text-[#FFFAF1] transition-colors">
                  The Veranda & Accents
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#AC9368] mb-5">
              Materiality & Craft
            </h4>
            <ul className="space-y-3 font-sans text-[#A69F91]">
              <li>
                <Link href="/materials" className="hover:text-[#FFFAF1] transition-colors">
                  Solid FSC European Oak
                </Link>
              </li>
              <li>
                <Link href="/materials#travertine" className="hover:text-[#FFFAF1] transition-colors">
                  Honed Roman Travertine
                </Link>
              </li>
              <li>
                <Link href="/materials#fabrics" className="hover:text-[#FFFAF1] transition-colors">
                  Tactile Bouclé & Linen
                </Link>
              </li>
              <li>
                <Link href="/materials#leather" className="hover:text-[#FFFAF1] transition-colors">
                  Vegetable-Tanned Leather
                </Link>
              </li>
              <li>
                <Link href="/materials#care" className="hover:text-[#FFFAF1] transition-colors">
                  Care & Maintenance Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#AC9368] mb-5">
              The Studio
            </h4>
            <ul className="space-y-3 font-sans text-[#A69F91]">
              <li>
                <Link href="/about" className="hover:text-[#FFFAF1] transition-colors">
                  Studio Philosophy
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-[#FFFAF1] transition-colors">
                  The Journal
                </Link>
              </li>
              <li>
                <Link href="/about#joinery" className="hover:text-[#FFFAF1] transition-colors">
                  Artisan Joinery
                </Link>
              </li>
              <li>
                <Link href="/about#custom" className="hover:text-[#FFFAF1] transition-colors">
                  Bespoke Commissions
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-[#FFFAF1] transition-colors">
                  Visit & Appointments
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section: Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-sans text-[#686358]">
          <p>© {new Date().getFullYear()} Ember & Ash. All rights reserved. Sourced & crafted with honest intention.</p>
          <div className="flex items-center gap-6">
            <span>Bangkok • Chiang Mai</span>
            <span>Privacy Policy</span>
            <span>Terms of Curation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
