'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Pagination } from '@/components/collections/Pagination';
import { Product } from './PremiumProductCard';
import { AsymmetricGrid } from './AsymmetricGrid';

interface CollectionGroup {
  id: string;
  product_sup: string;
}

interface CatalogLayoutProps {
  products: Product[];
  collectionGroups: CollectionGroup[];
  totalCount: number;
  itemsPerPage: number;
}

  // Hardcoded category hierarchy — always shown, DB id lookup used for filtering
  const CATEGORY_STRUCTURE: { label: string; members: string[] }[] = [
    { label: 'Chair', members: ['Arm chair', 'Bar stool', 'Dining chair', 'Lounge Chair', 'Side Chair'] },
    { label: 'Modular & Sofa', members: ['Modular Sofa', 'Sofa'] },
    { label: 'Bedroom Collection', members: [] },
    { label: 'Table', members: ['Coffee Table', 'Night Table', 'Working Table', 'Side Table', 'Dining Table'] },
    { label: 'Leg', members: ['Leg Dining Table', 'Leg Coffee Table', 'Leg side Table'] },
    { label: 'Stool & Ottoman', members: [] },
    { label: 'Shelf', members: [] },
    { label: 'Cabinet & More', members: [] },
    { label: 'Dressing & Working', members: [] },
    { label: 'Accessories', members: [] },
  ];

export function CatalogLayout({
  products,
  collectionGroups,
  totalCount,
  itemsPerPage,
}: CatalogLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const isClearingAllRef = useRef(false);
  const currentMaterials = searchParams.get('material')?.split(',').filter(Boolean) || [];
  const currentGroups = searchParams.get('group')?.split(',').filter(Boolean) || [];
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');



  // Accordion open state per category parent
  const [openCatGroups, setOpenCatGroups] = useState<Record<string, boolean>>({});

  // groupedCategories: always includes ALL hardcoded items
  // items with no DB match have id=undefined (shown dimmed, not clickable)
  const groupedCategories = React.useMemo(() => {
    const existingSups = new Set(collectionGroups.map(g => g.product_sup.toLowerCase()));

    return CATEGORY_STRUCTURE.map((cat) => {
      const items = cat.members.map((name) => ({
        name,
        // Instead of ID, we pass the exact name as the filter value if it exists in DB
        id: existingSups.has(name.toLowerCase()) ? name : undefined,
      }));
      return { 
        label: cat.label, 
        items,
        // If parent has no items, it acts as its own filter
        id: existingSups.has(cat.label.toLowerCase()) ? cat.label : undefined
      };
    });
  }, [collectionGroups]);



  // Debounce search
  useEffect(() => {
    if (isClearingAllRef.current) {
      isClearingAllRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      const currentQ = current.get('q') || '';
      if (currentQ !== searchTerm) {
        if (searchTerm) current.set('q', searchTerm);
        else current.delete('q');
        current.delete('page');
        startTransition(() => {
          router.push(`${pathname}?${current.toString()}`, { scroll: false });
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  // Lock body scroll on mobile when filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  const updateParams = (key: string, values: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (values.length > 0) current.set(key, values.join(','));
    else current.delete(key);
    current.delete('page');
    startTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  };

  const handleMaterialToggle = (material: string) => {
    const next = currentMaterials.includes(material) ? [] : [material];
    updateParams('material', next);
  };

  const handleGroupToggle = (groupId: string) => {
    const next = currentGroups.includes(groupId) ? [] : [groupId];
    updateParams('group', next);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (e.target.value) current.set('sort', e.target.value);
    else current.delete('sort');
    startTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  };

  const handleClearAll = () => {
    if (searchTerm !== '') {
      isClearingAllRef.current = true;
      setSearchTerm('');
    }
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = currentMaterials.length > 0 || currentGroups.length > 0 || !!searchTerm;

  const filterPanelContent = (
    <div className="flex flex-col gap-10">

          {/* Search */}
          <div>
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted block mb-3">
              Search
            </span>
            <div className="relative border-b border-sage focus-within:border-sage transition-colors duration-300 pb-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pieces…"
                className="w-full bg-transparent border-none py-2 pl-7 pr-2 font-sans text-[13px] text-ink outline-none placeholder:text-muted/50"
              />
              <svg viewBox="0 0 24 24" className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 stroke-muted stroke-[1.5px] fill-none">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Sort */}
          <div>
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted block mb-3">
              Sort By
            </span>
            <div className="border-b border-sage focus-within:border-sage transition-colors duration-300 pb-1">
              <select
                className="w-full border-none bg-transparent font-sans text-[13px] font-medium text-ink outline-none cursor-pointer"
                value={searchParams.get('sort') || ''}
                onChange={handleSortChange}
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="border-b border-sage/40 pb-6">
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted block mb-4">
              Category
            </span>
            <div className="flex flex-col gap-1">
              {groupedCategories.map((cat) => {
                const isOpen = openCatGroups[cat.label];
                const hasItems = cat.items.length > 0;
                const anyActive = cat.items.some((item) => item.id && currentGroups.includes(item.id));

                // Categories with no sub-items: parent is the direct filter item
                if (!hasItems) {
                  const id = cat.id;
                  const isActive = id ? currentGroups.includes(id) : false;
                  const noData = !id;
                  return (
                    <div key={cat.label}>
                      <button
                        onClick={() => id && handleGroupToggle(id)}
                        className={`flex items-center justify-between w-full text-left py-1.5 group relative ${noData ? 'cursor-default' : ''}`}
                      >
                        <span
                          className={`font-sans text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                            isActive ? 'text-sage' : noData ? 'text-muted/50' : 'text-ink group-hover:text-sage'
                          }`}
                        >
                          {cat.label}
                        </span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={cat.label}>
                    {/* Parent header */}
                    <button
                      onClick={() =>
                        setOpenCatGroups((prev) => ({ ...prev, [cat.label]: !prev[cat.label] }))
                      }
                      className="flex items-center justify-between w-full text-left py-1.5 group relative"
                    >
                      <span
                        className={`font-sans text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                          anyActive ? 'text-sage' : 'text-ink group-hover:text-sage'
                        }`}
                      >
                        {cat.label}
                        {anyActive && <span className="ml-1 opacity-60 text-[8px]">●</span>}
                      </span>
                      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current stroke-2 fill-none flex-shrink-0 text-muted">
                        {isOpen ? (
                          <line x1="5" y1="12" x2="19" y2="12" />
                        ) : (
                          <>
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </>
                        )}
                      </svg>
                    </button>

                    {/* Sub-items — always shown from hardcoded list, dimmed if no DB match */}
                    {isOpen && (
                      <div className="flex flex-col gap-2 pl-3 pb-2">
                        {cat.items.map((item) => {
                          const isActive = item.id ? currentGroups.includes(item.id) : false;
                          const noData = !item.id;
                          return (
                            <button
                              key={item.name}
                              onClick={() => item.id && handleGroupToggle(item.id)}
                              className={`flex items-center text-left text-[12px] font-medium w-full group relative ${noData ? 'cursor-default' : 'transition-colors hover:text-sage'}`}
                            >
                              <span
                                className={`w-[5px] h-[5px] bg-sage absolute left-0 transition-transform duration-300 ${
                                  isActive ? 'scale-100' : 'scale-0'
                                }`}
                              />
                              <span
                                className={`font-sans tracking-wide transition-all duration-200 ${
                                  isActive
                                    ? 'text-sage pl-4 font-semibold'
                                    : noData
                                    ? 'text-muted/50 pl-2'
                                    : 'text-body pl-2 group-hover:pl-4'
                                }`}
                              >
                                {item.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


          {/* Material Filter */}
          <div className="border-b border-sage/40 pb-6">
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-muted block mb-4">
              Material
            </span>
            <div className="flex flex-col gap-3">
              {['Solid Wood', 'Bouclé Fabric', 'Leather'].map((material) => {
                const isActive = currentMaterials.includes(material);
                return (
                  <button
                    key={material}
                    onClick={() => handleMaterialToggle(material)}
                    className="flex items-center text-left text-[12px] font-medium transition-colors hover:text-sage w-full group relative"
                  >
                    <span className={`w-[5px] h-[5px] bg-sage absolute left-0 transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-0'}`} />
                    <span className={`font-sans tracking-wide transition-all duration-200 ${isActive ? 'text-sage pl-4 font-semibold' : 'text-body pl-2 group-hover:pl-4'}`}>
                      {material}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage hover:text-olive transition-colors text-left bg-transparent border-none cursor-pointer"
              onClick={handleClearAll}
            >
              Clear all ×
            </button>
          )}

          {/* Provenance note */}
          <div className="border-t border-sage/20 pt-6 mt-2">
            <span className="font-sans text-[9px] uppercase tracking-widest text-sage block mb-2">
              Provenance
            </span>
            <div className="text-[10px] font-medium text-body leading-[1.7] uppercase tracking-wider">
              Timber: FSC Certified Oak<br />
              Upholstery: Belgian Bouclé<br />
              Batch No: EA-04-2026
            </div>
          </div>
        </div>
  );

  return (
    <main id="catalog" className="w-full max-w-[1600px] mx-auto px-6 md:px-20 lg:px-32 xl:px-[180px] pt-28 pb-20 lg:pt-36">

      {/* Sage loading bar — appears at top when filter is fetching */}
      <div
        className="fixed top-0 left-0 z-50 h-[2px] bg-sage transition-all duration-500"
        style={{
          width: isPending ? '100%' : '0%',
          opacity: isPending ? 1 : 0,
          transition: isPending
            ? 'width 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease'
            : 'opacity 300ms ease 100ms, width 0ms ease 400ms',
        }}
      />

      {/* Page Title */}
      <div className="mb-12 border-b border-hairline/40 pb-8 flex items-end gap-6">
        <div className="w-[3px] h-12 bg-sage flex-shrink-0 self-stretch" />
        <div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage mb-2.5 block">
            Collection Directory
          </span>
          <h1 className="font-serif text-[38px] md:text-[52px] font-medium leading-[1.05] text-ink tracking-tight">
            Curated Exhibition
          </h1>
        </div>
      </div>

      {/* Two-column layout: filter panel LEFT, products RIGHT */}
      <div className="flex gap-8 xl:gap-12 items-start relative min-h-[1000px] [overflow-anchor:none]">

        {/* ── LEFT: Sticky Filter Panel ─────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col gap-10 w-[180px] xl:w-[200px] flex-shrink-0 sticky top-[120px] self-start max-h-[calc(100vh-140px)] overflow-y-auto [scrollbar-width:none] h-fit z-10"
        >
          {filterPanelContent}
        </aside>

        {/* ── RIGHT: Product Grid ──────────────────────────────────── */}
        <div
          className="flex-1 min-w-0 [overflow-anchor:none]"
          style={{
            opacity: isPending ? 0.5 : 1,
            transition: 'opacity 200ms ease',
            pointerEvents: isPending ? 'none' : 'auto',
          }}
        >

          {/* Item count */}
          <div className="font-sans text-[11px] text-muted mb-8">
            Showing{' '}
            <span className="text-ink font-semibold">{products.length}</span>
            {' '}of{' '}
            <span className="text-ink font-semibold">{totalCount}</span>
            {' '}pieces
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-8">
              {currentMaterials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => handleMaterialToggle(mat)}
                  className="inline-flex items-center gap-1.5 bg-sage/10 text-sage hover:bg-sage/20 transition-colors px-3 py-1.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
                >
                  {mat}
                  <span className="text-[12px] -mr-0.5">×</span>
                </button>
              ))}
              {currentGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => handleGroupToggle(group)}
                  className="inline-flex items-center gap-1.5 bg-sage/10 text-sage hover:bg-sage/20 transition-colors px-3 py-1.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
                >
                  {group}
                  <span className="text-[12px] -mr-0.5">×</span>
                </button>
              ))}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-1.5 bg-sage/10 text-sage hover:bg-sage/20 transition-colors px-3 py-1.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
                >
                  &quot;{searchTerm}&quot;
                  <span className="text-[12px] -mr-0.5">×</span>
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 border border-sage/40 text-sage hover:bg-sage hover:text-canvas transition-all px-3 py-1.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider"
              >
                Clear All ×
              </button>
            </div>
          )}

          {products.length > 0 ? (
            <AsymmetricGrid products={products} />
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-muted border border-dashed border-hairline w-full">
              <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-muted stroke-[1.5px] fill-none mb-3">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-[14px]">No pieces found matching your filters.</p>
            </div>
          )}

          <Pagination totalItems={totalCount} itemsPerPage={itemsPerPage} />
        </div>

      </div>

      {/* ── Mobile Floating Filter Button ─────────────────────────── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 bg-sage text-canvas px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] font-sans text-[11px] font-bold uppercase tracking-[0.15em] transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current stroke-[1.5px] fill-none">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          Filter & Sort
          {hasActiveFilters && (
            <span className="flex items-center justify-center w-[18px] h-[18px] bg-canvas text-sage rounded-full text-[9px] ml-1 font-bold">
              {currentMaterials.length + currentGroups.length + (searchTerm ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile Drawer ─────────────────────────── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex justify-start">
          <div 
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-[85%] max-w-[340px] bg-canvas h-screen max-h-screen overflow-y-auto pt-8 pb-32 px-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-sage/30 pb-4">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-ink">Filters</span>
              <div className="flex items-center gap-4">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage hover:text-olive transition-colors cursor-pointer"
                  >
                    Clear all ×
                  </button>
                )}
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2 text-ink cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current stroke-[1.5px] fill-none">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            {filterPanelContent}
          </div>
        </div>
      )}
    </main>
  );
}
