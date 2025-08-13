"use client";

import React from "react";
import type { Product } from "@/lib/shopify/types";
import { useProduct } from "@/components/product/product-context";

export default function SizeSelector({ product }: { product: Product }) {
  const { state, updateOption } = useProduct();

  const sizeOpt = product.options.find(
    (o) => o.name.toLowerCase() === "size"
  );
  if (!sizeOpt) return null;

  const disabledValues = new Set(
    product.variants
      .filter((v) => !v.availableForSale)
      .map((v) =>
        v.selectedOptions.find((o) => o.name.toLowerCase() === "size")?.value
      )
  );

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="size">
      {sizeOpt.values.map((v) => {
        const selected = state.size === v;
        const disabled = disabledValues.has(v);
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => {
              updateOption("size", v);
            }}
            className={
              [
                // Square shape
                "w-11 h-11",
                // Center content
                "inline-flex items-center justify-center",
                // Rounding and fine border (0.5px)
                "rounded-lg border-[0.5px]",
                // Typography
                "text-base lowercase",
                // Transition
                "transition-colors",
                //Font
                "font-light",
                selected
                  ? "bg-black text-white border-black"
                  : "bg-[#F5F5F5] text-neutral-800 border-[#E5E5E5] hover:bg-neutral-200",
                disabled ? "opacity-40 cursor-not-allowed" : ""
              ].join(" ")
            }
          >
            <span className="leading-none -translate-y-px md:-translate-y-[1px] inline-block">
              {v}
            </span>
          </button>
        );
      })}
    </div>
  );
}


