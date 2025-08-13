// in-lieu-official/src/content/productContent.tsx
import React from "react";

export type CompositionItem = {
    icon: string;      // /images/materials/alpaca.svg
    alt: string;       // Alpaca icon
    percent: number;   // 40
    name: string;      // Alpaca
  };


export type SizeGuide = {
  image: { src: string; alt?: string };
  sizes: string[];
  measurements: Array<{
    key: string;
    label: string;
    position: { x: number; y: number; align?: "left" | "right" | "center" };
  }>;
  // Values should be stored in centimeters; UI can convert to inches
  values: Record<string, Record<string, number>>;
  modelNotes?: React.ReactNode;
};

export type ProductLocalContent = {
  sizeGuide?: SizeGuide;
  long?: React.ReactNode;
  care?: React.ReactNode;
  composition?: CompositionItem[];
};

export const PRODUCT_CONTENT_BY_HANDLE: Record<string, ProductLocalContent> = {
  // Replace with your actual product handles
  "avril": {
    sizeGuide: {
      image: { src: "/images/size-charts/avril_size_chart.png", alt: "Avril size chart" },
      sizes: ["xs", "s", "m", "l", "xl"],
      measurements: [
        { key: "shoulder", label: "Shoulder", position: { x: 50, y: 7 } },
        { key: "sleeve", label: "Sleeve", position: { x: 13, y: 64 } },
        { key: "chest", label: "Chest", position: { x: 50, y: 60 } },
        { key: "body", label: "Body", position: { x: 84, y: 64 } },
        { key: "hem", label: "Hem", position: { x: 50, y: 93} }
      ],
      // Example placeholder values in centimeters; adjust per product
      values: {
        xs: { shoulder: 47, sleeve: 50, chest: 51, body: 60, hem: 48 },
        s:  { shoulder: 48.5, sleeve: 51, chest: 53, body: 62, hem: 49.5 },
        m:  { shoulder: 50, sleeve: 52, chest: 55, body: 64, hem: 51 },
        l:  { shoulder: 51.5, sleeve: 53, chest: 57, body: 66, hem: 52.5 },
        xl: { shoulder: 53, sleeve: 54, chest: 59, body: 68, hem: 54 }
      },
      modelNotes: (
        <div className="space-y-1">
          <p >Tatsuki is <strong>6&apos;0</strong> and wearing a <strong>L</strong></p>
          <p>Mina is <strong>5&apos;6</strong> and wearing a <strong>M</strong></p>
        </div>
      )
    },
    composition: [
        { icon: "/images/composition_icons/alpaca.png", alt: "Alpaca icon", percent: 40, name: "Alpaca" },
        { icon: "/images/composition_icons/wool.png", alt: "Wool icon", percent: 40, name: "Wool" },
        { icon: "/images/composition_icons/nylon.png", alt: "Nylon icon", percent: 16, name: "Nylon" },
        { icon: "/images/composition_icons/spandex.png", alt: "Spandex icon", percent: 4, name: "Spandex" }
      ]
  },
  "lyon": {
    sizeGuide: {
      image: { src: "/images/size-charts/avril_size_chart.png", alt: "Avril size chart" },
      sizes: ["xs", "s", "m", "l", "xl"],
      measurements: [
        { key: "shoulder", label: "Shoulder", position: { x: 50, y: 7 } },
        { key: "sleeve", label: "Sleeve", position: { x: 13, y: 64 } },
        { key: "chest", label: "Chest", position: { x: 50, y: 60 } },
        { key: "body", label: "Body", position: { x: 84, y: 64 } },
        { key: "hem", label: "Hem", position: { x: 50, y: 93} }
      ],
      // Example placeholder values in centimeters; adjust per product
      values: {
        xs: { shoulder: 47, sleeve: 50, chest: 51, body: 60, hem: 48 },
        s:  { shoulder: 48.5, sleeve: 51, chest: 53, body: 62, hem: 49.5 },
        m:  { shoulder: 50, sleeve: 52, chest: 55, body: 64, hem: 51 },
        l:  { shoulder: 51.5, sleeve: 53, chest: 57, body: 66, hem: 52.5 },
        xl: { shoulder: 53, sleeve: 54, chest: 59, body: 68, hem: 54 }
      },
      modelNotes: (
        <div className="space-y-1">
          <p >Tatsuki is <strong>6&apos;0</strong> and wearing a <strong>L</strong></p>
          <p>Mina is <strong>5&apos;6</strong> and wearing a <strong>M</strong></p>
        </div>
      )
    },
    composition: [
        { icon: "/images/composition_icons/polyester.png", alt: "Polyester icon", percent: 70, name: "Polyester" },
        { icon: "/images/composition_icons/wool.png", alt: "Wool icon", percent: 30, name: "Wool" },

      ]
  },
};

export function getLocalProductContent(handle: string): ProductLocalContent | undefined {
  return PRODUCT_CONTENT_BY_HANDLE[handle];
}