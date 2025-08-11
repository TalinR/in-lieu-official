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
        <div className="flex items-center gap-4">
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="flex items-center gap-4">
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
      {guide.modelNotes && guide.modelNotes.length > 0 && (
        <ul className="list-disc ml-5 space-y-1 text-sm font-light text-neutral-700">
          {guide.modelNotes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}


