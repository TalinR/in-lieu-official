import React from 'react';
import type { Product } from '@/lib/shopify/types';

export default function Copy({ product }: { product: Product }) {
  const blurb = product.seo?.description || product.description || '';
  return (
    <div className="space-y-3">
      <h1 className="text-4xl  font-regular text-black leading-tight tracking-[-0.02em]">{product.title}</h1>
      <p className="text-lg font-light text-black max-w-prose leading-[1.14] tracking-[-0.02em]">{blurb}</p>
    </div>
  );
}


