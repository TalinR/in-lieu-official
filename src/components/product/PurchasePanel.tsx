"use client";

import React from "react";
import type { Product } from "@/lib/shopify/types";
import SizeSelector from "./SizeSelector";
import { AddToCart } from "@/components/cart/add-to-cart";

const SIZE_GUIDE_SECTION_ID = 'find-your-size';

export default function PurchasePanel({ product }: { product: Product }) {

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <SizeSelector product={product} />
        <button
          type="button"
          className="shrink-0 inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-700"
          aria-label="Open size guide"
          onClick={() => {
            // Dispatch custom event to open the section
            window.dispatchEvent(
              new CustomEvent('openSection', {
                detail: { sectionId: SIZE_GUIDE_SECTION_ID }
              })
            );
          }}
        >
          <svg
            aria-hidden="true"
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            className="text-neutral-600"
          >
            <rect x="1" y="5" width="1" height="6" rx="1" fill="currentColor" />
            <rect x="5" y="3" width="1" height="8" rx="1" fill="currentColor" />
            <rect x="9" y="1" width="1" height="10" rx="1" fill="currentColor" />
            <rect x="13" y="4" width="1" height="7" rx="1" fill="currentColor" />
          </svg>
          <span className="font-light">size guide</span>
        </button>
      </div>
      <div className="relative">
        <AddToCart product={product} />
      </div>
    </div>
  );
}


