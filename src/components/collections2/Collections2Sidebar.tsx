'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface CollectionGroup {
  id: string;
  product_sup: string;
}

interface Collections2SidebarProps {
  collectionGroups?: CollectionGroup[];
}

// Static category hierarchy — sub-item names must match product_sup values in DB
const CATEGORY_GROUPS = [
  {
    label: 'Chair',
    items: ['Arm chair', 'Bar stool', 'Dining chair', 'Lounge Chair', 'Side Chair'],
  },
  {
    label: 'Modular & Sofa',
    items: ['Modular Sofa', 'Sofa'],
  },
  {
    label: 'Bedroom Collection',
    items: [],
  },
  {
    label: 'Table',
    items: ['Coffee Table', 'Night Table', 'Working Table', 'Side Table', 'Dining Table'],
  },
  {
    label: 'Leg',
    items: ['Leg Dining Table', 'Leg Coffee Table', 'Leg side Table'],
  },
  {
    label: 'Stool & Ottoman',
    items: [],
  },
  {
    label: 'Shelf',
    items: [],
  },
  {
    label: 'Cabinet & More',
    items: [],
  },
  {
    label: 'Dressing & Working',
    items: [],
  },
  {
    label: 'Accessories',
    items: [],
  },
];

export function Collections2Sidebar({ collectionGroups = [] }: Collections2SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMaterials = searchParams.get('material')?.split(',').filter(Boolean) || [];
  const currentGroups = searchParams.get('group')?.split(',').filter(Boolean) || [];

  // Build lookup: product_sup (lowercase) → id
  const supToId = React.useMemo(() => {
    const map: Record<string, string> = {};
    collectionGroups.forEach((g) => {
      map[g.product_sup.toLowerCase()] = g.id;
    });
    return map;
  }, [collectionGroups]);

  // Accordion open state per category group
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CATEGORY_GROUPS.forEach((g) => {
      initial[g.label] = false;
    });
    return initial;
  });

  const updateParams = (key: string, values: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (values.length > 0) {
      current.set(key, values.join(','));
    } else {
      current.delete(key);
    }
    current.delete('page'); // Reset to page 1
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const handleGroupToggle = (groupId: string) => {
    let newGroups = [...currentGroups];
    if (groupId === 'all') {
      newGroups = [];
    } else if (newGroups.includes(groupId)) {
      newGroups = newGroups.filter((g) => g !== groupId);
    } else {
      newGroups.push(groupId);
    }
    updateParams('group', newGroups);
  };

  const handleMaterialToggle = (material: string) => {
    let newMaterials = [...currentMaterials];
    if (newMaterials.includes(material)) {
      newMaterials = newMaterials.filter((m) => m !== material);
    } else {
      newMaterials.push(material);
    }
    updateParams('material', newMaterials);
  };

  const handleClearAll = () => {
    router.push(pathname);
  };





  return (
    <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 sticky top-28 h-fit border-r border-hairline pr-10">

      {/* ── 1. Category Filter — Grouped + Collapsible ── */}
      <div className="border-b border-hairline pb-8 mb-8">
        <h4 className="font-serif text-[13px] font-semibold uppercase tracking-[0.15em] text-ink mb-4">
          Category
        </h4>

        {/* All Categories reset */}
        <button
          onClick={() => handleGroupToggle('all')}
          className="flex items-center text-left text-[13px] font-medium transition-colors hover:text-sage w-full group relative mb-4"
        >
          <Dot active={currentGroups.length === 0} />
          <span
            className={`font-sans tracking-wide transition-all ${
              currentGroups.length === 0
                ? 'text-sage pl-4 font-semibold'
                : 'text-body pl-2 group-hover:pl-4'
            }`}
          >
            All Categories
          </span>
        </button>

        {/* Grouped categories */}
        <div className="flex flex-col">
          {CATEGORY_GROUPS.map((cat) => {
            const isOpen = openGroups[cat.label];
            const hasItems = cat.items.length > 0;

            if (!hasItems) {
              // No sub-items → parent itself is the filter item
              const id = supToId[cat.label.toLowerCase()];
              const isActive = id ? currentGroups.includes(id) : false;
              return (
                <div key={cat.label} className="border-t border-hairline/40">
                  <button
                    onClick={() => id && handleGroupToggle(id)}
                    className="flex items-center text-left text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors hover:text-sage w-full group relative py-2.5"
                  >
                    <Dot active={isActive} />
                    <span
                      className={`transition-all ${
                        isActive ? 'text-sage pl-4' : 'text-ink pl-2 group-hover:pl-4'
                      }`}
                    >
                      {cat.label}
                    </span>
                  </button>
                </div>
              );
            }

            // Has sub-items → collapsible accordion
            const anySubActive = cat.items.some((item) => {
              const id = supToId[item.toLowerCase()];
              return id ? currentGroups.includes(id) : false;
            });

            return (
              <div key={cat.label} className="border-t border-hairline/40">
                {/* Parent header — click to expand/collapse */}
                <button
                  className="flex items-center justify-between w-full text-left py-2.5 group relative"
                  onClick={() =>
                    setOpenGroups((prev) => ({ ...prev, [cat.label]: !prev[cat.label] }))
                  }
                >
                  <Dot active={anySubActive} />
                  <span
                    className={`text-[12px] font-semibold uppercase tracking-[0.08em] transition-all ${
                      anySubActive
                        ? 'text-sage pl-4'
                        : 'text-ink pl-2 group-hover:pl-4 group-hover:text-sage'
                    }`}
                  >
                    {cat.label}
                    {anySubActive && (
                      <span className="ml-1.5 text-[9px] align-middle opacity-60">●</span>
                    )}
                  </span>
                  <AccordionIcon open={isOpen} />
                </button>

                {/* Sub-items */}
                {isOpen && (
                  <div className="flex flex-col gap-2 pb-2.5 pl-4">
                    {cat.items.map((item) => {
                      const id = supToId[item.toLowerCase()];
                      const isActive = id ? currentGroups.includes(id) : false;
                      return (
                        <button
                          key={item}
                          onClick={() => id && handleGroupToggle(id)}
                          className="flex items-center text-left text-[13px] font-medium transition-colors hover:text-sage w-full group relative"
                        >
                          <Dot active={isActive} />
                          <span
                            className={`font-sans tracking-wide transition-all ${
                              isActive
                                ? 'text-sage pl-4 font-semibold'
                                : 'text-body pl-2 group-hover:pl-4'
                            }`}
                          >
                            {item}
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

      {/* ── 2. Material Filter ── */}
      <div className="border-b border-hairline pb-8 mb-8">
        <h4 className="font-serif text-[13px] font-semibold uppercase tracking-[0.15em] text-ink mb-6">
          Material Palette
        </h4>
        <div className="flex flex-col gap-3">
          {['Solid Wood', 'Bouclé Fabric', 'Leather'].map((material) => {
            const isActive = currentMaterials.includes(material);
            return (
              <button
                key={material}
                onClick={() => handleMaterialToggle(material)}
                className="flex items-center text-left text-[13px] font-medium transition-colors hover:text-sage w-full group relative"
              >
                <span
                  className={`w-[6px] h-[6px] bg-sand absolute left-0 transition-transform duration-300 ${
                    isActive ? 'scale-100' : 'scale-0'
                  }`}
                />
                <span
                  className={`font-sans tracking-wide transition-all ${
                    isActive ? 'text-sage pl-4 font-semibold' : 'text-body pl-2 group-hover:pl-4'
                  }`}
                >
                  {material}
                </span>
              </button>
            );
          })}
        </div>

        {(currentMaterials.length > 0 || currentGroups.length > 0) && (
          <button
            className="text-[10px] font-bold uppercase tracking-[0.1em] text-sage hover:text-olive transition-colors mt-6 block text-left"
            onClick={handleClearAll}
          >
            Reset Filters &times;
          </button>
        )}
      </div>

      {/* ── 3. Curation Note ── */}
      <div className="border-b border-hairline pb-8 mb-8">
        <span className="font-sans text-[9px] uppercase tracking-widest text-muted block mb-3">
          Curation Principles
        </span>
        <p className="font-serif text-[14px] text-body leading-[1.6] italic">
          &ldquo;The visual language blends the raw organic beauty of nature with refined structural
          modernism. We prioritize pure forms and uncompromised materials.&rdquo;
        </p>
      </div>

      {/* ── 4. Exhibition Provenance ── */}
      <div className="flex flex-col gap-2">
        <span className="font-sans text-[9px] uppercase tracking-widest text-muted block mb-1">
          Exhibition Provenance
        </span>
        <div className="text-[11px] font-medium text-body leading-[1.5] uppercase tracking-wider">
          Origin: Stockholm / Bangkok
          <br />
          Timber: FSC Certified Oak
          <br />
          Upholstery: Belgian Bouclé
          <br />
          Batch No: EA-04-2026
        </div>
      </div>
    </aside>
  );
}

const AccordionIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-ink stroke-2 fill-none flex-shrink-0">
    {open ? (
      <line x1="5" y1="12" x2="19" y2="12" />
    ) : (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    )}
  </svg>
);

const Dot = ({ active }: { active: boolean }) => (
  <span
    className={`w-[6px] h-[6px] bg-sage absolute left-0 transition-transform duration-300 ${
      active ? 'scale-100' : 'scale-0'
    }`}
  />
);
