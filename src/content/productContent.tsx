// in-lieu-official/src/content/productContent.tsx
import React from "react";

export type CompositionItem = {
    icon: string;      // /images/materials/alpaca.svg
    alt: string;       // Alpaca icon
    percent: number;   // 40
    name: string;      // Alpaca
  };

export type ProductLocalContent = {
  // Simple image-based size chart; expand as needed
  sizeChart?: { src: string; alt?: string };
  // You can keep these as React nodes for flexibility
  long?: React.ReactNode;
  care?: React.ReactNode;
  composition?: CompositionItem[];
};

export const PRODUCT_CONTENT_BY_HANDLE: Record<string, ProductLocalContent> = {
  // Replace with your actual product handles
  "avril": {
    composition: [
        { icon: "/images/composition_icons/alpaca.png", alt: "Alpaca icon", percent: 40, name: "Alpaca" },
        { icon: "/images/composition_icons/wool.png", alt: "Wool icon", percent: 40, name: "Wool" },
        { icon: "/images/composition_icons/nylon.png", alt: "Nylon icon", percent: 16, name: "Nylon" },
        { icon: "/images/composition_icons/spandex.png", alt: "Spandex icon", percent: 4, name: "Spandex" }
      ],
    // sizeChart: { src: "/images/size-charts/product-a.png", alt: "Size chart" },
    // long: (
    //   <>
    //     <p>This is a custom long description for Product A.</p>
    //     <p>Second paragraph with more details.</p>
    //     <strong>Some bold emphasis here.</strong>
    //   </>
    // ),
    // care: (
    //   <>
    //     <p>Machine wash cold, line dry.</p>
    //     <p>Do not bleach.</p>
    //   </>
    // )
  },
};

export function getLocalProductContent(handle: string): ProductLocalContent | undefined {
  return PRODUCT_CONTENT_BY_HANDLE[handle];
}