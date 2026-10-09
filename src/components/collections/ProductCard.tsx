import React from 'react';
import Link from 'next/link';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image_url?: string;
  category_id?: string;
  specs?: {
    material?: string;
    [key: string]: unknown;
  };
}

export function ProductCard({ product }: { product: Product }) {
  // Use a fallback image if none provided
  const imageUrl = product.image_url || 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600';
  
  return (
    <div className="bg-surface border border-transparent rounded-none p-3 lg:p-4 flex flex-col relative group cursor-pointer hover:border-sage transition-colors">
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
      
      <div className="w-full aspect-square bg-[#F5F2EC] flex items-center justify-center overflow-hidden mb-4 relative">
        <img 
          key={imageUrl}
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
      </div>

      <h4 className="text-[12px] font-medium uppercase tracking-[0.05em] text-ink mb-1 truncate">
        {product.name}
      </h4>
      <p className="text-[12px] text-muted mb-3 truncate">
        {product.specs?.material || product.category_id || 'Premium Material'}
      </p>

      <div className="flex justify-between items-center mt-auto pb-1 relative z-20">
        <p className="text-[13px] font-medium text-ink">
          ฿{Number(product.price).toLocaleString()}
        </p>
        <button 
          className="w-6 h-6 grid place-content-center bg-transparent border-none cursor-pointer text-ink hover:opacity-70 transition-opacity"
          aria-label="Add to cart"
        >
          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-ink stroke-[1.5px] fill-none">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
