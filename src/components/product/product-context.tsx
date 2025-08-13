'use client';

import { useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useState } from 'react';

type ProductState = {
  [key: string]: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  // Initialize once from URL params, then keep state purely client-side
  const [state, setState] = useState<ProductState>(() => {
    const params: ProductState = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  });

  const updateOption = (name: string, value: string) => {
    setState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ProductContext.Provider value={{ state, updateOption }}>
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