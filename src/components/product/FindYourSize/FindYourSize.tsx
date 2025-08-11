"use client";

import React, { useMemo, useState } from "react";
import type { Measurements, SizeGuide, SizeKey } from "@/content/productContent";
import UnitToggle, { type Unit } from "./UnitToggle";
import SizeChips from "./SizeChips";
import MeasurementDiagram from "./MeasurementDiagram";

function cmToIn(cm: number) {
  return Math.round((cm / 2.54) * 10) / 10; // one decimal
}

function convert(values: Measurements, unit: Unit): Measurements {
  if (unit === "metric") return values;
  return {
    shoulder: cmToIn(values.shoulder),
    chest: cmToIn(values.chest),
    body: cmToIn(values.body),
    hem: cmToIn(values.hem)
  } as Measurements;
}

export default function FindYourSize({ guide }: { guide?: SizeGuide }) {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [size, setSize] = useState<SizeKey>("s");

  const availableSizes: SizeKey[] = useMemo(() => {
    return (Object.keys(guide?.measurements ?? {}) as SizeKey[]).length
      ? (Object.keys(guide!.measurements) as SizeKey[])
      : (["xs", "s", "m", "l", "xl"] as SizeKey[]);
  }, [guide]);

  const raw = guide?.measurements?.[size];
  const converted = raw ? convert(raw, unit) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 max-w-[560px]">
          <UnitToggle value={unit} onChange={setUnit} />
        </div>
        <div className="flex-1 flex justify-end">
          <SizeChips value={size} onChange={setSize} sizes={availableSizes} />
        </div>
      </div>

      {converted && (
        <MeasurementDiagram
          values={converted}
          unit={unit}
          diagram={guide?.diagram}
          labels={guide?.labels}
          height={560}
        />
      )}

      {guide?.notes && (
        <div className="text-neutral-600 font-light text-base space-y-1">
          {guide.notes}
        </div>
      )}
    </div>
  );
}


