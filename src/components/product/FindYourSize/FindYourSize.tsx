"use client";

import React, { useMemo, useState } from "react";
import type { SizeGuide } from "@/content/productContent";
import UnitToggle, { type Unit } from "./UnitToggle";
import SizeChips from "./SizeChips";
import MeasurementDiagram from "./MeasurementDiagram";

export default function FindYourSize({ guide }: { guide?: SizeGuide }) {
  const [unit, setUnit] = useState<Unit>("metric");
  const [selectedSize, setSelectedSize] = useState<string>(() => guide?.sizes?.[0] ?? "");

  const currentValues = useMemo(() => {
    if (!guide || !selectedSize) return undefined;
    return guide.values[selectedSize];
  }, [guide, selectedSize]);

  if (!guide) {
    return <p className="text-sm text-neutral-600">—</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-auto">
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="w-full sm:w-auto">
          <SizeChips
            sizes={guide.sizes}
            selected={selectedSize || guide.sizes[0]}
            onSelect={setSelectedSize}
          />
        </div>
      </div>

      {/* Diagram */}
      <MeasurementDiagram guide={guide} unit={unit} values={currentValues} />

      {/* Model notes */}
      {guide.modelNotes && (
        <div className="text-md font-light text-neutral-800">
          {guide.modelNotes}
        </div>
      )}
    </div>
  );
}


