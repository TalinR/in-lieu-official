'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Product } from '@/lib/shopify/types';

interface ProductContextType {
  product: Product;
  state: Record<string, string>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ 
  children, 
  product 
}: { 
  children: ReactNode;
  product: Product;
}) {
  // For now, we'll keep state simple - just track the current product
  // In a full implementation, this would handle variant selection
  const state: Record<string, string> = {};

  return (
    <ProductContext.Provider value={{ product, state }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}