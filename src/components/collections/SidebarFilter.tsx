'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface CollectionGroup {
  id: string;
  product_sup: string;
}

interface SidebarFilterProps {
  collectionGroups?: CollectionGroup[];
}

// Hardcoded category hierarchy — always shown regardless of DB data
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

export function SidebarFilter({ collectionGroups = [] }: SidebarFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMaterials = searchParams.get('material')?.split(',').filter(Boolean) || [];
  const currentGroups = searchParams.get('group')?.split(',').filter(Boolean) || [];

  // Build lookup: product_sup (lowercase) → id from DB
  const supToId = React.useMemo(() => {
    const map: Record<string, string> = {};
    collectionGroups.forEach((g) => {
      map[g.product_sup.toLowerCase()] = g.id;
    });
    return map;
  }, [collectionGroups]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CATEGORY_GROUPS.forEach((g) => {
      initial[g.label] = false;
    });
    return initial;
  });

  const [materialOpen, setMaterialOpen] = useState(true);

  const updateParams = (key: string, values: string[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (values.length > 0) {
      current.set(key, values.join(','));
    } else {
      current.delete(key);
    }
    current.delete('page');
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  const handleGroupChange = (groupId: string) => {
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

  const handleMaterialChange = (material: string) => {
    let newMaterials = [...currentMaterials];
    if (material === 'all') {
      newMaterials = [];
    } else if (newMaterials.includes(material)) {
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
    <aside className="hidden lg:flex flex-col gap-0 w-[260px] flex-shrink-0">

      {/* Category Section — always shows all hardcoded items */}
      <div className="border-b border-hairline pb-4 mb-1">
        <div className="py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink mb-1">
          Category
        </div>

        {/* All Categories reset */}
        <label
          className="flex items-center gap-3 text-[13px] cursor-pointer select-none group mb-3"
          onClick={() => handleGroupChange('all')}
        >
          <CheckboxIcon checked={currentGroups.length === 0} />
          <span className="text-muted">All Categories</span>
        </label>

        <div className="flex flex-col">
          {CATEGORY_GROUPS.map((cat) => {
            const isOpen = openGroups[cat.label];
            const hasItems = cat.items.length > 0;

            if (!hasItems) {
              const id = supToId[cat.label.toLowerCase()];
              const isActive = id ? currentGroups.includes(id) : false;
              const noData = !id;
              return (
                <div key={cat.label} className="border-t border-hairline/60">
                  <label
                    className={`flex items-center gap-3 py-2.5 select-none ${noData ? 'cursor-default' : 'cursor-pointer group'}`}
                    onClick={() => id && handleGroupChange(id)}
                  >
                    <CheckboxIcon checked={isActive} disabled={noData} />
                    <span
                      className={`text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                        isActive ? 'text-sage' : noData ? 'text-muted/60' : 'text-ink'
                      }`}
                    >
                      {cat.label}
                    </span>
                  </label>
                </div>
              );
            }

            const anySubActive = cat.items.some((item) => {
              const id = supToId[item.toLowerCase()];
              return id ? currentGroups.includes(id) : false;
            });

            return (
              <div key={cat.label} className="border-t border-hairline/60">
                <button
                  className="flex items-center justify-between w-full py-2.5 text-left"
                  onClick={() =>
                    setOpenGroups((prev) => ({ ...prev, [cat.label]: !prev[cat.label] }))
                  }
                >
                  <span
                    className={`text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                      anySubActive ? 'text-sage' : 'text-ink'
                    }`}
                  >
                    {cat.label}
                    {anySubActive && (
                      <span className="ml-1.5 text-[9px] align-middle opacity-60">●</span>
                    )}
                  </span>
                  <AccordionIcon open={isOpen} />
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-1.5 pb-2.5 pl-3">
                    {cat.items.map((item) => {
                      const id = supToId[item.toLowerCase()];
                      const isActive = id ? currentGroups.includes(id) : false;
                      const noData = !id;
                      return (
                        <label
                          key={item}
                          className={`flex items-center gap-3 select-none ${noData ? 'cursor-default' : 'cursor-pointer group'}`}
                          onClick={() => id && handleGroupChange(id)}
                        >
                          <CheckboxIcon checked={isActive} disabled={noData} />
                          <span
                            className={`text-[13px] transition-colors ${
                              isActive
                                ? 'text-sage font-medium'
                                : noData
                                ? 'text-muted/60'
                                : 'text-body'
                            }`}
                          >
                            {item}
                          </span>
                        </label>
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
      <div className="border-b border-hairline pb-4 mb-1">
        <div
          className="flex justify-between items-center py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => setMaterialOpen(!materialOpen)}
        >
          <span>Material</span>
          <AccordionIcon open={materialOpen} />
        </div>
        {materialOpen && (
          <div className="flex flex-col gap-2 pt-1">
            <label
              className="flex items-center gap-3 text-[13px] cursor-pointer select-none group"
              onClick={() => handleMaterialChange('all')}
            >
              <CheckboxIcon checked={currentMaterials.length === 0} />
              <span className="text-body">All Materials</span>
            </label>
            {['Solid Wood', 'Bouclé Fabric', 'Leather'].map((material) => (
              <label
                key={material}
                className="flex items-center gap-3 text-[13px] cursor-pointer select-none group"
                onClick={() => handleMaterialChange(material)}
              >
                <CheckboxIcon checked={currentMaterials.includes(material)} />
                <span className="text-body">{material}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Wood Type Filter */}
      <div className="border-b border-hairline pb-4 mb-1">
        <div className="flex justify-between items-center py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink cursor-pointer hover:opacity-70 transition-opacity">
          <span>Wood Type</span>
          <AccordionIcon open={false} />
        </div>
      </div>

      {/* Room Filter */}
      <div className="border-b border-hairline pb-4 mb-1">
        <div className="flex justify-between items-center py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink cursor-pointer hover:opacity-70 transition-opacity">
          <span>Room</span>
          <AccordionIcon open={false} />
        </div>
      </div>

      {/* Price Filter */}
      <div className="border-b border-hairline pb-4 mb-1">
        <div className="flex justify-between items-center py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink cursor-pointer hover:opacity-70 transition-opacity">
          <span>Price</span>
          <AccordionIcon open={false} />
        </div>
      </div>

      <div
        className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted cursor-pointer mt-2 hover:text-ink transition-colors w-fit"
        onClick={handleClearAll}
      >
        Clear All
      </div>
    </aside>
  );
}

const CheckboxIcon = ({ checked, disabled }: { checked: boolean; disabled?: boolean }) => (
  <div
    className={`w-4 h-4 border bg-surface grid place-content-center transition-colors ${
      disabled
        ? 'border-hairline opacity-40'
        : checked
        ? 'border-ink'
        : 'border-muted group-hover:border-ink'
    }`}
  >
    <div className={`w-[10px] h-[10px] bg-sage transition-transform ${checked ? 'scale-100' : 'scale-0'}`} />
  </div>
);

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
