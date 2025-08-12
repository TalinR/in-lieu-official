"use client";

import React from "react";

export default function SizeChips({
  sizes,
  selected,
  onSelect
}: {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2 sm:flex sm:flex-wrap sm:gap-2" role="radiogroup" aria-label="size">
      {sizes.map((s) => {
        const isSelected = s === selected;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(s)}
            className={[
              "w-full sm:w-11 h-11 inline-flex items-center justify-center rounded-lg border-[0.5px] text-base lowercase transition-colors font-light",
              isSelected
                ? "bg-black text-white border-black"
                : "bg-[#F5F5F5] text-neutral-800 border-[#E5E5E5] hover:bg-neutral-200"
            ].join(" ")}
          >
            <span className="leading-none -translate-y-px md:-translate-y-[1px] inline-block">
              {s}
            </span>
          </button>
        );
      })}
    </div>
  );
}


