import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/supabase/server';
import { Header } from '@/components/layout/Header';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductAccordion, AccordionItem } from '@/components/product/ProductAccordion';
import { PremiumProductCard } from '@/components/collections2/PremiumProductCard';
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

import { Product } from '@/components/collections2/PremiumProductCard';
import { Variant } from '@/components/product/ProductActions';
import { calculateProductDiscount, DiscountInfo } from '@/lib/discount';

interface DetailedProduct extends Product {
  width_cm?: number;
  length_cm?: number;
  thickness_cm?: number;
  color?: string;
  description?: string;
  weight?: number;
  sku?: string;
  unit?: string;
}

export const dynamic = 'force-dynamic';

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  let product: DetailedProduct | null = null;
  let recommendedProducts: Product[] = [];
  let discountInfo: DiscountInfo = {
    originalPrice: 0,
    finalPrice: 0,
    hasDiscount: false,
  };

  let collectionGroupName = '';

  const { data, error } = await supabase
    .from('products')
    .select('*, discount_rules(id, discounts(id, name, discount_type, value, active))')
    .eq('id', params.id)
    .single();

  if (!error && data) {
    const disc = calculateProductDiscount(data.price, data.discount_rules);
    discountInfo = disc;
    product = {
      ...data,
      price: disc.finalPrice,
      original_price: disc.originalPrice,
      discount_percent: disc.discountPercent,
      discount_label: disc.discountLabel,
    } as DetailedProduct;

    // Fetch collection group name if group ID exists
    if (product.collection_group_id) {
      const { data: groupData } = await supabase
        .from('collection_groups')
        .select('product_sup')
        .eq('id', product.collection_group_id)
        .single();
      if (groupData) {
        collectionGroupName = groupData.product_sup;
      }
    }

    // Fetch recommended products prioritizing the same sub-category or head category
    let recData: Product[] = [];
    try {
      let currentSup = '';
      if (product?.collection_group_id) {
        const { data: cg } = await supabase
          .from('collection_groups')
          .select('id, product_sup')
          .eq('id', product.collection_group_id)
          .single();
        if (cg) currentSup = cg.product_sup || '';
      }

      const mapRecProduct = (p: any): Product => {
        const disc = calculateProductDiscount(p.price, p.discount_rules);
        return {
          ...p,
          price: disc.finalPrice,
          original_price: disc.originalPrice,
          discount_percent: disc.discountPercent,
          discount_label: disc.discountLabel,
        };
      };

      // Fetch candidates from same furniture / EMBER catalog
      const { data: rawRecs } = await supabase
        .from('products')
        .select('*, collection_groups(id, product_sup), discount_rules(id, discounts(id, name, discount_type, value, active))')
        .neq('id', params.id)
        .or('category_id.eq.furniture,sku.ilike.EMBER%')
        .limit(60);

      if (rawRecs && rawRecs.length > 0) {
        const seenGroup = new Set<string>();
        if (product?.collection_group_id) {
          seenGroup.add(product.collection_group_id);
        }

        // Pass 1: Products with same product_sup
        if (currentSup) {
          rawRecs.forEach((p: any) => {
            const key = p.collection_group_id || p.name;
            const pSup = p.collection_groups?.product_sup || '';
            if (pSup && pSup.toLowerCase() === currentSup.toLowerCase() && !seenGroup.has(key) && recData.length < 8) {
              seenGroup.add(key);
              recData.push(mapRecProduct(p));
            }
          });
        }

        // Pass 2: Products in other categories to fill up to 8
        rawRecs.forEach((p: any) => {
          const key = p.collection_group_id || p.name;
          if (!seenGroup.has(key) && recData.length < 8) {
            seenGroup.add(key);
            recData.push(mapRecProduct(p));
          }
        });
      }
    } catch (err) {
      console.error('Failed smart recommendations fetch:', err);
    }

    recommendedProducts = recData.slice(0, 8);
  }

  if (!product) {
    notFound();
  }

  // Fetch all variants in the same collection group
  let groupProducts: Variant[] = [];
  if (product && product.collection_group_id) {
    const { data: siblingData } = await supabase
      .from('products')
      .select('id, color, price, image_url, specs, discount_rules(id, discounts(id, name, discount_type, value, active))')
      .eq('collection_group_id', product.collection_group_id)
      .order('id', { ascending: true });
    if (siblingData) {
      groupProducts = siblingData.map((s: any) => {
        const disc = calculateProductDiscount(s.price, s.discount_rules);
        return {
          id: s.id,
          color: s.color,
          price: disc.finalPrice,
          original_price: disc.originalPrice,
          discount_percent: disc.discountPercent,
          discount_label: disc.discountLabel,
          image_url: s.image_url,
          specs: s.specs,
        };
      });
    }
  }

  // Fallback image handling
  const mainImage = product.image_url || 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600';
  
  // Extract extra images from specs.images if they exist
  let extraImages: string[] = [];
  if (product.specs?.images && Array.isArray(product.specs.images)) {
    extraImages = (product.specs.images as unknown[])
      .filter((img): img is { path: string; sort?: number } => 
        typeof img === 'object' && img !== null && 'path' in img && typeof (img as { path: unknown }).path === 'string'
      )
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .map((img) => img.path);
  }

  // Extract dimensions and specs from product root and specs JSON
  const specs = (product.specs && typeof product.specs === 'object' ? product.specs : {}) as Record<string, any>;
  const widthRaw = Number(product.width_cm || specs.width_cm) || null;
  const lengthRaw = Number(product.length_cm || specs.length_cm) || null;
  const depthRaw = Number(specs.depth_cm) || null;
  const heightRaw = Number(product.thickness_cm || specs.thickness_cm || specs.height_cm) || null;

  // Format single dimension (converting mm >= 100 to cm while keeping mm reference)
  const formatDim = (val: number | null) => {
    if (!val) return null;
    if (val >= 100) {
      const cm = (val / 10).toFixed(0);
      return `${cm} cm (${val} mm)`;
    }
    return `${val} cm`;
  };

  const formattedWidth = formatDim(widthRaw);
  const formattedLength = formatDim(lengthRaw);
  const formattedDepth = formatDim(depthRaw);
  const formattedHeight = formatDim(heightRaw);

  // Overall Dimensions summary
  const dimParts: string[] = [];
  if (widthRaw) dimParts.push(`W ${widthRaw >= 100 ? (widthRaw / 10).toFixed(0) : widthRaw}`);
  if (depthRaw) dimParts.push(`D ${depthRaw >= 100 ? (depthRaw / 10).toFixed(0) : depthRaw}`);
  else if (lengthRaw) dimParts.push(`L ${lengthRaw >= 100 ? (lengthRaw / 10).toFixed(0) : lengthRaw}`);
  if (heightRaw) dimParts.push(`H ${heightRaw >= 100 ? (heightRaw / 10).toFixed(0) : heightRaw}`);
  const dimensionsSummary = dimParts.length > 0 ? `${dimParts.join(' × ')} cm` : null;

  const material = specs.material || (specs.materials ? String(specs.materials) : null);
  const color = product.color || specs.color || specs.colour || null;
  const unit = product.unit || 'Piece';
  const weight = product.weight && product.weight > 0 ? `${product.weight} kg` : null;

  const accordionItems: AccordionItem[] = [
    {
      title: 'Description',
      content: (
        <div className="space-y-3">
          <p>
            {product.description || 'A timeless piece crafted with premium materials. Designed to bring warmth and structural modernism into your living space.'}
          </p>
          <p className="text-[12px] text-muted/80 italic">
            Each piece is custom finished to highlight the organic character and architectural silhouette of the design.
          </p>
        </div>
      ),
    },
    {
      title: 'Specifications & Dimensions',
      content: (
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 py-1 text-[12px] font-sans">
          <div className="border-b border-hairline/60 pb-2">
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">SKU</span>
            <span className="text-ink font-medium">{product.sku || 'N/A'}</span>
          </div>

          <div className="border-b border-hairline/60 pb-2">
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">Collection</span>
            <span className="text-ink font-medium">{collectionGroupName || product.category_id || 'Furniture'}</span>
          </div>

          {dimensionsSummary && (
            <div className="border-b border-hairline/60 pb-2 col-span-2">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">Dimensions (W × D × H)</span>
              <span className="text-ink font-medium">{dimensionsSummary}</span>
            </div>
          )}

          {formattedWidth && (
            <div className="border-b border-hairline/60 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">Width</span>
              <span className="text-ink font-medium">{formattedWidth}</span>
            </div>
          )}

          {(formattedDepth || formattedLength) && (
            <div className="border-b border-hairline/60 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">
                {formattedDepth ? 'Depth' : 'Length'}
              </span>
              <span className="text-ink font-medium">{formattedDepth || formattedLength}</span>
            </div>
          )}

          {formattedHeight && (
            <div className="border-b border-hairline/60 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">Height</span>
              <span className="text-ink font-medium">{formattedHeight}</span>
            </div>
          )}

          {material && (
            <div className="border-b border-hairline/60 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">Material</span>
              <span className="text-ink font-medium">{material}</span>
            </div>
          )}

          {color && (
            <div className="border-b border-hairline/60 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">Color / Tone</span>
              <span className="text-ink font-medium">{color}</span>
            </div>
          )}

          {weight && (
            <div className="border-b border-hairline/60 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">Weight</span>
              <span className="text-ink font-medium">{weight}</span>
            </div>
          )}

          <div className="border-b border-hairline/60 pb-2">
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">Assembly</span>
            <span className="text-ink font-medium">Pre-assembled / Ready to place</span>
          </div>

          <div className="border-b border-hairline/60 pb-2">
            <span className="text-[10px] uppercase tracking-wider text-muted font-bold block mb-0.5">Packaging</span>
            <span className="text-ink font-medium">1 {unit} per Protective Export Crate</span>
          </div>
        </div>
      ),
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Header />
      
      <main className="w-full max-w-[1800px] mx-auto px-6 md:px-20 lg:px-32 xl:px-[180px] pt-28 pb-10 lg:pt-36 lg:pb-16">
        
        {/* Back Link */}
        <Link 
          href="/collections2" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted hover:text-sage transition-colors mb-6 group"
        >
          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current stroke-[1.5px] fill-none transition-transform duration-300 group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Curation
        </Link>
        
        {/* Breadcrumb */}
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-8">
          Collections / {collectionGroupName || product.category_id || 'Furniture'} / <span className="text-ink">{product.name}</span>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-20">
          
          {/* Left Column: Scrollable Image Gallery */}
          <div className="w-full">
            <ProductGallery mainImage={mainImage} extraImages={extraImages} />
          </div>

          {/* Right Column: Sticky Details Sidebar */}
          <div className="w-full relative">
            <div className="sticky top-24 h-fit flex flex-col">
              
              <ProductActions 
                id={product.id} 
                name={product.name} 
                price={product.price}
                originalPrice={discountInfo.originalPrice}
                discountPercent={discountInfo.discountPercent}
                discountLabel={discountInfo.discountLabel}
                variants={groupProducts}
              />
              
              <ProductAccordion items={accordionItems} />

              {/* Sustainability Badge */}
              <div className="mt-8 flex items-center gap-4 text-muted border-t border-hairline pt-6">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-ink stroke-[1.5px] fill-none">
                  {/* Simplistic FSC tree icon representation */}
                  <path d="M12 22V12" />
                  <path d="M12 12C12 12 7 10 7 6C7 2 12 2 12 2s5 0 5 4c0 4-5 6-5 6z" />
                  <path d="M12 12c0 0-3-1-3-4" />
                  <path d="M12 17c0 0 3-1 3-3" />
                </svg>
                <div className="text-[11px] uppercase tracking-[0.05em] font-medium leading-[1.4]">
                  Sustainably sourced<br />wood materials.
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-14 md:mt-20 pt-10 md:pt-14 pb-12 border-t border-hairline relative">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage mb-2 block whitespace-nowrap">
                  Curated Collection
                </span>
                <h2 className="font-serif text-[26px] sm:text-[30px] md:text-[34px] font-normal md:font-medium tracking-tight text-ink leading-tight whitespace-normal sm:whitespace-nowrap">
                  You May Also Like
                </h2>
              </div>
              <Link 
                href="/collections2" 
                className="flex-shrink-0 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink hover:text-sage transition-colors group pb-1.5 border-b border-ink/20 hover:border-sage self-start md:self-auto"
              >
                View all pieces
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current stroke-[1.5px] fill-none transition-transform duration-300 group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {recommendedProducts.map((p, index) => (
                <PremiumProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
