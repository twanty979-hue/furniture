'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header({ dynamic = false }: { dynamic?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!dynamic) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run initially

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dynamic]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isTransparent = dynamic && !isScrolled;
  const isCollectionsActive = pathname === '/collections2';

  const navLinks = [
    { name: 'Collections', href: '/collections2#catalog', active: isCollectionsActive },
    { name: 'Rooms', href: '/collections2#catalog', active: false },
    { name: 'Materials', href: '#', active: false },
    { name: 'About', href: '#', active: false },
    { name: 'Journal', href: '#', active: false },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMenuOpen(false);
    if (href.includes('#catalog')) {
      if (pathname === '/collections2') {
        e.preventDefault();
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <header
        className={`w-full z-50 transition-all duration-500 ease-in-out ${
          isTransparent
            ? 'absolute top-0 left-0 bg-transparent border-b border-transparent py-6 px-6 md:px-20 lg:px-32 xl:px-[180px]'
            : 'fixed top-0 left-0 bg-canvas/92 backdrop-blur-md border-b border-hairline py-3.5 px-6 md:px-20 lg:px-32 xl:px-[180px] shadow-sm'
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex justify-between items-center relative">

          {/* Left: Brand Logo (Dynamic theme swap) */}
          <div className="flex items-center z-10">
            <Link href="/" className="flex items-center">
              <img
                src="/image-Photoroom.png"
                alt="Ember & Ash Logo"
                className={`h-14 md:h-16 w-auto object-contain transition-all duration-500 ${
                  isTransparent ? 'brightness-0 invert' : ''
                }`}
              />
            </Link>
          </div>

          {/* Center: Navigation Links (Dynamic color swap) */}
          <ul className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 justify-center gap-8 list-none z-0">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-[12px] font-semibold uppercase tracking-[0.1em] py-1 transition-all duration-300 border-b-2 ${
                    link.active
                      ? isTransparent
                        ? 'text-white border-white'
                        : 'text-ink border-sage'
                      : isTransparent
                        ? 'text-canvas/75 border-transparent hover:border-canvas/40 hover:text-white'
                        : 'text-ink/75 border-transparent hover:text-sage'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Action Buttons & Hamburger (Dynamic color swap) */}
          <div className="flex justify-end items-center gap-3 sm:gap-4 z-10">
            <button
              className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] transition-all duration-300 ${
                isTransparent ? 'text-canvas/80 hover:text-white' : 'text-ink/80 hover:text-sage'
              }`}
              aria-label="Search"
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-4 h-4 fill-none stroke-[1.5px] transition-all duration-300 ${
                  isTransparent ? 'stroke-canvas' : 'stroke-ink'
                }`}
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="hidden lg:inline">Search</span>
            </button>

            <button
              className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] transition-all duration-300 ${
                isTransparent ? 'text-canvas/80 hover:text-white' : 'text-ink/80 hover:text-sage'
              }`}
              aria-label="Wishlist"
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-4 h-4 fill-none stroke-[1.5px] transition-all duration-300 ${
                  isTransparent ? 'stroke-canvas' : 'stroke-ink'
                }`}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="hidden lg:inline">Wishlist</span>
            </button>

            <button
              className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.05em] transition-all duration-300 ${
                isTransparent ? 'text-canvas/80 hover:text-white' : 'text-ink/80 hover:text-sage'
              }`}
              aria-label="Cart"
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-4 h-4 fill-none stroke-[1.5px] transition-all duration-300 ${
                  isTransparent ? 'stroke-canvas' : 'stroke-ink'
                }`}
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="hidden lg:inline">Cart (0)</span>
            </button>

            {/* Hamburger Button (Always visible on all screens) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex flex-col justify-center items-center w-9 h-9 rounded-md transition-all duration-300 focus:outline-none ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-ink hover:bg-ink/5'
              }`}
              aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span
                  className={`block h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                    isTransparent ? 'bg-white' : 'bg-ink'
                  } ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                    isTransparent ? 'bg-white' : 'bg-ink'
                  } ${isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full transition-all duration-300 ease-in-out ${
                    isTransparent ? 'bg-white' : 'bg-ink'
                  } ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
                />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Drawer / Slide-out Menu (Available on all screens) */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] sm:w-[400px] max-w-[420px] bg-canvas z-50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out border-l border-hairline ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 flex items-center justify-between border-b border-hairline/60">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
            <img
              src="/image-Photoroom.png"
              alt="Ember & Ash Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-ink/70 hover:text-ink hover:bg-ink/5 transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.5px]">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-6">
          <div className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">
            Menu Navigation
          </div>
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`flex items-center justify-between text-base uppercase tracking-[0.12em] font-medium py-2 transition-all ${
                  link.active
                    ? 'text-sage font-semibold border-b border-sage'
                    : 'text-ink/80 hover:text-sage border-b border-hairline/40'
                }`}
              >
                <span>{link.name}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current stroke-[1.5px] opacity-40"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            ))}
          </nav>

          {/* Quick Actions in Mobile Drawer */}
          <div className="pt-6 border-t border-hairline space-y-3">
            <div className="text-[11px] font-semibold tracking-[0.2em] text-muted uppercase mb-3">
              Account & Shopping
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm text-ink/80 hover:bg-ink/5 transition-colors"
            >
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.5px]">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search Products
              </span>
            </button>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm text-ink/80 hover:bg-ink/5 transition-colors"
            >
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.5px]">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Wishlist
              </span>
            </button>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm text-ink/80 hover:bg-ink/5 transition-colors"
            >
              <span className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.5px]">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Shopping Cart
              </span>
              <span className="text-xs bg-sage text-canvas px-2 py-0.5 rounded-full font-semibold">0</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-hairline bg-surface/50 text-xs text-muted">
          <p className="font-serif italic mb-1">Ember & Ash — Curated Living</p>
          <p className="text-[11px] opacity-75">Crafted with timeless natural materials.</p>
        </div>
      </div>
    </>
  );
}
