import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CollectionsHero } from '@/components/collections2/CollectionsHero';
import { CatalogLayout } from '@/components/collections2/CatalogLayout';
import { Product } from '@/components/collections2/PremiumProductCard';
import { calculateProductDiscount } from '@/lib/discount';
import { createClient } from '@/supabase/server';

export const dynamic = 'force-dynamic';

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

function matchesCategory(sup: string, target: string): boolean {
  const s = sup.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  if (s === t) return true;
  const sNorm = s.replace(/[^a-z0-9]/g, '');
  const tNorm = t.replace(/[^a-z0-9]/g, '');
  if (sNorm === tNorm) return true;
  if ((sNorm.includes('bed') && tNorm.includes('bed')) && (sNorm.includes('collection') && tNorm.includes('collection'))) return true;
  if ((sNorm.includes('working') && (sNorm.includes('desk') || sNorm.includes('table'))) &&
      (tNorm.includes('working') && (tNorm.includes('desk') || tNorm.includes('table')))) return true;
  return false;
}

export default async function Collections2Page(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) || 1 : 1;
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : '';
  const materialParam = typeof searchParams?.material === 'string' ? searchParams.material : '';
  const groupParam = typeof searchParams?.group === 'string' ? searchParams.group : '';
  
  const itemsPerPage = 12;
  const from = (page - 1) * itemsPerPage;

  let products: Product[] = [];
  let totalCount = 0;
  let collectionGroups: { id: string; product_sup: string }[] = [];

  try {
    // Fetch all products belonging to furniture or EMBER catalog
    let query = supabase
      .from('products')
      .select('*, collection_groups(id, product_sup), discount_rules(id, discounts(id, name, discount_type, value, active))')
      .or('category_id.eq.furniture,sku.ilike.EMBER%')
      .limit(1000);

    const { data, error } = await query;
    if (error) {
      console.error('Supabase query error:', error.message);
    }

    const rawRows = (data as any[]) || [];

    // Extract all unique product_sup present in DB for sidebar matching
    const presentSups = new Set<string>();
    rawRows.forEach((p: any) => {
      if (p.collection_groups?.product_sup) {
        presentSups.add(p.collection_groups.product_sup);
      }
    });

    // Build enriched collectionGroups for the sidebar
    const enrichedGroups: { id: string; product_sup: string }[] = [];
    const dbSups = Array.from(presentSups);
    for (const cat of CATEGORY_STRUCTURE) {
      if (cat.members.length === 0) {
        if (dbSups.some(s => matchesCategory(s, cat.label))) {
          enrichedGroups.push({ id: cat.label, product_sup: cat.label });
        }
      } else {
        for (const m of cat.members) {
          if (dbSups.some(s => matchesCategory(s, m))) {
            enrichedGroups.push({ id: m, product_sup: m });
          }
        }
      }
    }
    dbSups.forEach(s => enrichedGroups.push({ id: s, product_sup: s }));
    collectionGroups = enrichedGroups;

    // Filter in-memory:
    let filteredRows = rawRows;

    // 1. Text search
    if (q) {
      const search = q.toLowerCase().trim();
      filteredRows = filteredRows.filter(p => (p.name || '').toLowerCase().includes(search));
    }

    // 2. Material filter
    if (materialParam) {
      const materials = materialParam.split(',').filter(Boolean).map(m => m.toLowerCase().trim());
      if (materials.length > 0) {
        filteredRows = filteredRows.filter(p => {
          const mat = (p.specs?.material || '').toLowerCase();
          return materials.some(m => mat.includes(m));
        });
      }
    }

    // 3. Category / Group filter
    if (groupParam) {
      const targets = groupParam.split(',').filter(Boolean).map(t => t.toLowerCase().trim());
      filteredRows = filteredRows.filter(p => {
        const sup = p.collection_groups?.product_sup || '';
        const grpId = (p.collection_group_id || '').toLowerCase();
        return targets.some(t => matchesCategory(sup, t) || grpId === t);
      });
    }

    // Map discount calculations
    let allRows: Product[] = filteredRows.map(p => {
      const disc = calculateProductDiscount(p.price, p.discount_rules);
      return {
        ...p,
        price: disc.finalPrice,
        original_price: disc.originalPrice,
        discount_percent: disc.discountPercent,
        discount_label: disc.discountLabel,
      };
    });

    // Sorting
    if (sort === 'price_asc') {
      allRows.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      allRows.sort((a, b) => b.price - a.price);
    } else {
      allRows.sort((a, b) => Number(b.id) - Number(a.id));
    }

    // Deduplicate: keep only the first product per collection_group_id.
    const seen = new Set<string>();
    const unique: Product[] = [];
    for (const p of allRows) {
      const key = p.collection_group_id ?? `__no_group_${p.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }

    totalCount = unique.length;
    products = unique.slice(from, from + itemsPerPage);

  } catch (err: unknown) {
    console.log('Database query error:', err instanceof Error ? err.message : String(err));
    totalCount = 0;
    products = [];
  }

  // Collection groups are already fetched above

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Header dynamic={true} />
      <CollectionsHero />
      <CatalogLayout 
        products={products}
        collectionGroups={collectionGroups}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
      />
      <Footer />
    </div>
  );
}
