"use client";

import React from "react";

export type Unit = "imperial" | "metric";

export default function UnitToggle({
  value,
  onChange
}: {
  value: Unit;
  onChange: (next: Unit) => void;
}) {
  const options: Unit[] = ["imperial", "metric"];

  return (
    <div
      role="radiogroup"
      aria-label="units"
      className="grid grid-cols-2 gap-3"
    >
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt)}
            className={[
              "h-12 md:h-12 w-full",
              "inline-flex items-center justify-center",
              "rounded-xl border-[0.5px]",
              "text-base lowercase font-light",
              "transition-colors",
              selected
                ? "bg-black text-white border-black"
                : "bg-[#F5F5F5] text-neutral-800 border-[#E5E5E5] hover:bg-neutral-200"
            ].join(" ")}
          >
            <span className="-translate-y-[1px]">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}


