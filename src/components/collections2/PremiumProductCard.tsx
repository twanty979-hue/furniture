'use client';

import React from 'react';
import Link from 'next/link';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image_url?: string;
  category_id?: string;
  collection_group_id?: string;
  specs?: {
    material?: string;
    [key: string]: unknown;
  };
}

export function PremiumProductCard({ product, index }: { product: Product; index: number }) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Extract all unique images
  const images = React.useMemo(() => {
    const list: string[] = [];
    if (product.image_url) {
      list.push(product.image_url);
    }
    const extraImages = product.specs?.images;
    if (Array.isArray(extraImages)) {
      extraImages.forEach((img: unknown) => {
        if (typeof img === 'string') {
          list.push(img);
        } else if (img && typeof img === 'object' && 'path' in img && typeof (img as { path: unknown }).path === 'string') {
          list.push((img as { path: string }).path);
        }
      });
    }
    return Array.from(new Set(list)).filter(Boolean);
  }, [product.image_url, product.specs?.images]);

  // Cycle images automatically if there are multiple
  React.useEffect(() => {
    if (images.length <= 1) return;

    let timer: NodeJS.Timeout;
    
    // Stagger start based on index to prevent cards from changing images in perfect unison
    const delay = index * 300;
    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timer) clearInterval(timer);
    };
  }, [images.length, currentImageIndex, index]);

  // Format index as dynamic serial
  const isSofa = product.name.toLowerCase().includes('sofa');
  const typeCode = isSofa ? 'SF' : 'FN';
  const serial = `EA / ${typeCode}-0${index + 1}`;

  return (
    <div className="bg-surface border border-hairline rounded-none flex flex-col relative group overflow-hidden transition-all duration-500 hover:border-sage hover:shadow-[0_16px_36px_rgba(0,0,0,0.05)]">
      {/* Architectural Image Box */}
      <div className="w-full aspect-square bg-canvas flex items-center justify-center overflow-hidden relative border-b border-hairline">
        {/* Subtle hover background transition */}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-700 z-10" />
        
        {images.length > 0 ? (
          images.map((imgUrl, idx) => (
            <img 
              key={`${product.id}-${idx}`}
              src={imgUrl} 
              alt={`${product.name} - view ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${
                currentImageIndex === idx 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            />
          ))
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600" 
            alt={product.name}
            className="w-full h-full object-contain"
          />
        )}
        
        {/* Gallery Dot Indicators for Multi-image Slabs */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 px-2.5 py-1 bg-ink/20 backdrop-blur-[3px] rounded-full">
            {images.map((_, idx) => (
              <button 
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCurrentImageIndex(idx);
                }}
                className={`h-[4px] rounded-full transition-all duration-500 focus:outline-none cursor-pointer ${
                  currentImageIndex === idx ? 'w-4 bg-white' : 'w-1 bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Gallery Tag Overlay */}
        <span className="absolute top-4 left-4 z-20 font-sans text-[9px] tracking-widest uppercase bg-sage text-white px-2.5 py-1 border border-sage font-bold">
          {serial}
        </span>
      </div>

      {/* Meta Specs & Identity */}
      <div className="p-3.5 md:p-5 flex flex-col flex-grow">
        {product.collection_group_id && (
          <Link
            href={`/collections2?group=${product.collection_group_id}`}
            className="relative z-20 inline-block font-sans text-[8px] md:text-[9px] uppercase tracking-widest text-sage hover:text-olive hover:underline mb-1 w-fit"
          >
            {product.collection_group_id} Collection
          </Link>
        )}
        {/* Top line: Name & Price */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
          <h3 className="font-sans font-medium text-[13px] md:text-[15px] leading-tight text-ink tracking-tight group-hover:text-sage transition-colors truncate">
            {product.name}
          </h3>
          <span className="font-sans text-[12px] md:text-[13px] font-medium text-ink">
            ฿{Number(product.price).toLocaleString()}
          </span>
        </div>

        {/* Bottom line: Material and Action */}
        <div className="flex justify-between items-end mt-auto pt-3 md:pt-4 border-t border-hairline/60">
          <div className="flex flex-col overflow-hidden">
            <span className="font-sans text-[8px] md:text-[9px] uppercase tracking-widest text-muted mb-0.5 hidden sm:block">
              Material Specification
            </span>
            <span className="font-sans text-[11px] md:text-[12px] text-body font-medium truncate max-w-[90px] xs:max-w-[120px] md:max-w-[180px]">
              {product.specs?.material || 'Premium Material'}
            </span>
          </div>

          <div className="w-7 h-7 md:w-8 md:h-8 rounded-none border border-hairline flex items-center justify-center bg-canvas text-ink group-hover:bg-sage group-hover:text-white group-hover:border-sage transition-all duration-300 relative z-20 flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] stroke-current stroke-[1.5px] fill-none">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Absolute overlay Link for entire card action */}
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
    </div>
  );
}
