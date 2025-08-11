"use client";

import React from "react";
import Image from "next/image";
import type { SizeGuide } from "@/content/productContent";
import type { Unit } from "./UnitToggle";

type Props = {
  guide: SizeGuide;
  unit: Unit;
  values?: Record<string, number>;
};

function convertAndFormat(valueInCm: number, unit: Unit): string {
  if (unit === "imperial") {
    const inches = valueInCm / 2.54;
    // Round to one decimal, trim trailing .0
    const rounded = Math.round(inches * 10) / 10;
    return `${rounded.toString()}in`;
  }
  return `${valueInCm.toString()}cm`;
}

export default function MeasurementDiagram({ guide, unit, values }: Props) {
  return (
    <div className="w-full">
      <div className="relative w-full max-w-xl mx-auto rounded-lg">
        <div className="relative aspect-square">
          <Image
            src={guide.image.src}
            alt={guide.image.alt ?? "size chart"}
            fill
            sizes="(min-width: 768px) 512px, 100vw"
            className="object-contain select-none"
            priority={false}
          />
        </div>
        {/* Labels */}
        {guide.measurements.map((m) => {
          const displayValue = values?.[m.key];
          if (displayValue == null) return null;
          return (
            <div
              key={m.key}
              className={[
                "pointer-events-none absolute z-10",
                "transform",
                "-translate-x-1/2 -translate-y-1/2 text-center",
                "flex flex-col items-center "
                
              ].join(" ")}
              style={{ left: `${m.position.x}%`, top: `${m.position.y}%` }}
            >
              <span className="text-neutral-600 font-light text-lg">{m.label}</span>
              <span className="text-neutral-600 text-lg mt-[-5px]">
                {convertAndFormat(displayValue, unit)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


