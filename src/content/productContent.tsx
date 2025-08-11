// in-lieu-official/src/content/productContent.tsx
import React from "react";

export type CompositionItem = {
    icon: string;      // /images/materials/alpaca.svg
    alt: string;       // Alpaca icon
    percent: number;   // 40
    name: string;      // Alpaca
  };


export type SizeKey = "xs" | "s" | "m" | "l" | "xl";
export type Measurements = { shoulder: number; chest: number; body: number; hem: number; };
export type LabelSpec = {
  id: string;
  title: string;
  key: keyof Measurements;
  style: React.CSSProperties; // absolute label container style
};
export type SizeGuide = {
  measurements: Record<SizeKey, Measurements>;
  notes?: React.ReactNode;
  diagram?: { src: string; alt?: string; naturalWidth?: number; naturalHeight?: number };
  labels?: LabelSpec[];
};


export type ProductLocalContent = {
  // Simple image-based size chart; expand as needed
  sizeChart?: { src: string; alt?: string };
  // You can keep these as React nodes for flexibility
  long?: React.ReactNode;
  care?: React.ReactNode;
  composition?: CompositionItem[];
  sizeGuide?: SizeGuide;

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
      sizeGuide: {
        measurements: {
          xs: { shoulder: 48, chest: 33, body: 48, hem: 48 },
          s:  { shoulder: 50, chest: 35, body: 50, hem: 50 },
          m:  { shoulder: 52, chest: 37, body: 52, hem: 52 },
          l:  { shoulder: 54, chest: 39, body: 54, hem: 54 },
          xl: { shoulder: 56, chest: 41, body: 56, hem: 56 }
        },
        notes: (
          <>
            <p>Tatsuki is 6’0 and wearing a <b>L</b></p>
            <p>Mina is 5’6 and wearing a <b>M</b></p>
          </>
        ),
        diagram: { src: "/images/size-charts/avril_size_chart.png", alt: "Size chart" },
        labels: [
          { id: "shoulder", title: "Shoulder", key: "shoulder", style: { top: "2%", left: "50%", transform: "translateX(-50%)", textAlign: "center"} },
          { id: "chest", title: "Chest", key: "chest", style: { top: "47%", left: "50%", transform: "translateX(-50%)", textAlign: "center" } },
          { id: "body-left", title: "Body", key: "body", style: { top: "58%", left: "6%", textAlign: "center" } },
          { id: "body-right", title: "Body", key: "body", style: { top: "58%", right: "6%", textAlign: "center" } },
          { id: "hem", title: "Hem", key: "hem", style: { bottom: "3%", left: "50%", transform: "translateX(-50%)", textAlign: "center" } }
        ]
    }
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