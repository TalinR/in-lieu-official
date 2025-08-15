"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Product handles to prefetch
const PRODUCT_HANDLES = ['avril', 'lyon'];

export default function ProductPagePrefetcher() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch all product pages using Next.js router prefetch
    PRODUCT_HANDLES.forEach(handle => {
      router.prefetch(`/products/${handle}`);
    });
  }, [router]);

  return null; // This component doesn't render anything
}
