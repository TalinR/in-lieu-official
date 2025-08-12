"use client";

import React from "react";

export type Unit = "metric" | "imperial";

export default function UnitToggle({
  unit,
  onChange
}: {
  unit: Unit;
  onChange: (unit: Unit) => void;
}) {
  const Button = ({ value, label }: { value: Unit; label: string }) => {
    const selected = unit === value;
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onChange(value)}
        className={[
          "w-full h-11 px-5 rounded-lg border-[0.5px] transition-colors font-light",
          selected
            ? "bg-black text-white border-black"
            : "bg-[#F5F5F5] text-neutral-800 border-[#E5E5E5] hover:bg-neutral-200"
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-3" role="tablist" aria-label="units">
      <Button value="imperial" label="imperial" />
      <Button value="metric" label="metric" />
    </div>
  );
}


