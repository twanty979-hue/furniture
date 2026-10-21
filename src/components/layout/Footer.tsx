import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-canvas text-ink border-t border-hairline/80 py-10 md:py-14 px-6 md:px-20 lg:px-32 xl:px-[180px]">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left: Brand Logo & Studio City */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
          <Link href="/" className="inline-block">
            <img
              src="/image-Photoroom.png"
              alt="Ember & Ash"
              className="h-10 md:h-11 w-auto object-contain"
            />
          </Link>
          <div className="hidden sm:block w-[1px] h-4 bg-hairline" />
          <span className="text-[11.5px] font-sans text-muted tracking-wider">
            Bangkok • Chiang Mai Atelier
          </span>
        </div>

        {/* Center: Essential Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[11px] font-sans uppercase tracking-[0.15em] font-semibold text-ink/75">
          <Link href="/collections2#catalog" className="hover:text-sage transition-colors">
            Collections
          </Link>
          <Link href="/rooms" className="hover:text-sage transition-colors">
            Rooms
          </Link>
          <Link href="/materials" className="hover:text-sage transition-colors">
            Materials
          </Link>
          <Link href="/about" className="hover:text-sage transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-sage transition-colors">
            Contact
          </Link>
          <Link href="/journal" className="hover:text-sage transition-colors">
            Journal
          </Link>
        </nav>

        {/* Right: Copyright */}
        <div className="text-[11px] font-sans text-muted tracking-wider text-center md:text-right">
          © {new Date().getFullYear()} Ember & Ash
        </div>
      </div>
    </footer>
  );
}
