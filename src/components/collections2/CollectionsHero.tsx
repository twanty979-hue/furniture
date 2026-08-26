'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register the plugins in an SSR-safe way
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

const SLIDE_DATA = [
  {
    tag: "Ember & Ash Curation",
    title: "Collections",
    desc: "Browse our catalog of custom-crafted architectural furniture. Each piece is designed to celebrate the raw, honest texture of timber, travertine, and natural fabrics.",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1783658898381-674.webp",
  },
  {
    tag: "Material Sourcing",
    title: "Provenance",
    desc: "We honor the weight of solid FSC Oak and hand-honed travertine. Exposed grains, tactile textures, and natural details define our curation ethos.",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1783658884219-216.webp",
  },
  {
    tag: "Form & Texture",
    title: "Living Space",
    desc: "Bringing architectural poise and comfort to residential interiors. Beautiful forms sculpted for a lifetime of sensory tactile warmth.",
    img: "https://pub-258bd10e7e8c4a7690a74c54cfbdef93.r2.dev/original/1783673557343-908.webp",
  }
];

export function CollectionsHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Set up auto-play loop (change slide every 6 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDE_DATA.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const prevIndexRef = useRef(0);

  useGSAP(() => {
    const currentIndex = activeIndex;
    const prevIndex = prevIndexRef.current;

    if (!slidesRef.current[currentIndex]) return;

    const currentSlide = slidesRef.current[currentIndex];
    const previousSlide = slidesRef.current[prevIndex];
    const currentImg = currentSlide.querySelector('.slide-img');
    const currentContent = currentSlide.querySelector('.slide-content');

    // Force hide and reset any stray slides if user clicks fast
    SLIDE_DATA.forEach((_, idx) => {
      if (idx !== currentIndex && idx !== prevIndex) {
        const slideEl = slidesRef.current[idx];
        if (!slideEl) return;
        gsap.killTweensOf(slideEl);
        gsap.set(slideEl, { visibility: 'hidden', zIndex: 1 });

        const img = slideEl.querySelector('.slide-img');
        const content = slideEl.querySelector('.slide-content');
        if (img && content) {
          gsap.killTweensOf([img, content]);
          gsap.set(img, { scale: 1.0, xPercent: 0 });
          gsap.set(content, { opacity: 0, y: 30 });
        }
      }
    });

    if (currentIndex === prevIndex) {
      // Initial Load
      gsap.set(currentSlide, { xPercent: 0, visibility: 'visible', zIndex: 10 });
      gsap.fromTo(currentImg,
        { scale: 1.0, xPercent: 0 },
        { scale: 1.08, xPercent: -3, duration: 6, ease: 'none', overwrite: 'auto' }
      );
      gsap.fromTo(currentContent,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.5, overwrite: 'auto' }
      );
    } else {
      // Transition
      let direction = 1;
      if (currentIndex > prevIndex) direction = 1;
      else if (currentIndex < prevIndex) direction = -1;

      // Wrap overrides for infinite loop
      if (currentIndex === 0 && prevIndex === SLIDE_DATA.length - 1) direction = 1;
      if (currentIndex === SLIDE_DATA.length - 1 && prevIndex === 0) direction = -1;

      const startX = 100 * direction;
      const endX = -100 * direction;

      gsap.set(currentSlide, { xPercent: startX, visibility: 'visible', zIndex: 10 });
      if (previousSlide) gsap.set(previousSlide, { zIndex: 5 });

      gsap.to(currentSlide, {
        xPercent: 0,
        duration: 1.4,
        ease: 'power3.inOut',
        overwrite: 'auto'
      });

      if (previousSlide) {
        gsap.to(previousSlide, {
          xPercent: endX,
          duration: 1.4,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(previousSlide, { visibility: 'hidden', zIndex: 1 });
            const prevImg = previousSlide.querySelector('.slide-img');
            const prevContent = previousSlide.querySelector('.slide-content');
            if (prevImg && prevContent) {
              gsap.killTweensOf([prevImg, prevContent]);
              gsap.set(prevImg, { scale: 1.0, xPercent: 0 });
              gsap.set(prevContent, { opacity: 0, y: 30 });
            }
          }
        });
      }

      gsap.fromTo(currentImg,
        { scale: 1.0, xPercent: 0 },
        { scale: 1.08, xPercent: -3, duration: 6, ease: 'none', overwrite: 'auto' }
      );
      gsap.fromTo(currentContent,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.5, overwrite: 'auto' }
      );
    }

    prevIndexRef.current = currentIndex;
  }, { dependencies: [activeIndex], scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-ink select-none"
    >
      {/* Stacked Slides Container */}
      <div className="absolute inset-0 w-full h-full">
        {SLIDE_DATA.map((slide, idx) => (
          <div
            key={idx}
            ref={(el) => { slidesRef.current[idx] = el; }}
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ visibility: idx === 0 ? 'visible' : 'hidden' }}
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 bg-ink/35 z-10" />
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover origin-center will-change-transform slide-img"
              />
            </div>

            {/* Slide Text Content */}
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6 slide-content opacity-0">
              <div className="flex flex-col items-center max-w-3xl mx-auto">
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#C1B59A] border border-sage/30 bg-sage/10 px-3 py-1 mb-6 inline-block">
                  {slide.tag}
                </span>
                <h1 className="font-serif text-[42px] sm:text-[80px] md:text-[96px] lg:text-[110px] font-medium leading-none text-canvas tracking-[-0.03em] uppercase drop-shadow-sm mb-6 break-words max-w-full">
                  {slide.title}
                </h1>
                <p className="font-sans text-[14px] sm:text-[16px] text-canvas/90 leading-[1.6] mb-8 font-light max-w-2xl">
                  {slide.desc}
                </p>
                <div className="w-12 h-[1px] bg-linen/50 mb-4" />
                <span className="font-sans text-[9px] tracking-widest uppercase text-linen/60">
                  Slide {idx + 1} / {SLIDE_DATA.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side Dots Indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        {SLIDE_DATA.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full border transition-all duration-500 cursor-pointer ${activeIndex === idx
              ? 'bg-sage border-sage scale-125'
              : 'bg-canvas/30 border-canvas/20 hover:bg-canvas/50'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down to Catalog Button */}
      <button
        onClick={() => {
          const el = document.getElementById('catalog');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-canvas/80 hover:text-white transition-all cursor-pointer group"
        aria-label="Scroll down to view products"
      >
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase transition-transform duration-300 group-hover:translate-y-0.5">
          Explore Pieces
        </span>
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 fill-none stroke-current stroke-[1.5px] animate-bounce"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </section>
  );
}
