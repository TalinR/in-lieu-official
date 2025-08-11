"use client";

import React from "react";
import type { SizeKey } from "@/content/productContent";

export default function SizeChips({
  value,
  onChange,
  sizes = ["xs", "s", "m", "l", "xl"]
}: {
  value: SizeKey;
  onChange: (next: SizeKey) => void;
  sizes?: SizeKey[];
}) {
  return (
    <div role="radiogroup" aria-label="size" className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const selected = value === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(s)}
            className={[
              "w-11 h-11",
              "inline-flex items-center justify-center",
              "rounded-lg border-[0.5px]",
              "text-base lowercase font-light",
              "transition-colors",
              selected
                ? "bg-black text-white border-black"
                : "bg-[#F5F5F5] text-neutral-800 border-[#E5E5E5] hover:bg-neutral-200"
            ].join(" ")}
          >
            <span className="leading-none -translate-y-[1px]">{s}</span>
          </button>
        );
      })}
    </div>
  );
}


