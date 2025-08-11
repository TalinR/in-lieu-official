"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { LabelSpec } from "@/content/productContent";

export type DiagramValues = {
  shoulder: number;
  chest: number;
  body: number;
  hem: number;
};

export default function MeasurementDiagram({
  values,
  unit,
  diagram,
  labels,
  height = 520,
  className
}: {
  values: DiagramValues;
  unit: "imperial" | "metric";
  diagram?: { src: string; alt?: string; naturalWidth?: number; naturalHeight?: number };
  labels?: LabelSpec[];
  height?: number; // pixels
  className?: string; // optional Tailwind overrides
}) {
  const unitLabel = unit === "metric" ? "cm" : "in";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(
    null
  );
  const [intrinsic, setIntrinsic] = useState<{ w: number; h: number } | null>(
    diagram?.naturalWidth && diagram?.naturalHeight
      ? { w: diagram.naturalWidth, h: diagram.naturalHeight }
      : null
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setContainerSize({ w: cr.width, h: cr.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const contentRect = useMemo(() => {
    if (!containerSize || !intrinsic) return null;
    const { w: cw, h: ch } = containerSize;
    const { w: iw, h: ih } = intrinsic;
    const scale = Math.min(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const left = (cw - dw) / 2;
    const top = (ch - dh) / 2;
    return { width: dw, height: dh, left, top };
  }, [containerSize, intrinsic]);

  return (
    <div
      className={["relative overflow-hidden", className].join(" ")}
      style={{ height }}
      ref={containerRef}
    >
      {diagram ? (
        <Image
          src={diagram.src}
          alt={diagram.alt || "Size diagram"}
          fill
          className="object-contain"
          sizes="100vw"
          priority={false}
          onLoadingComplete={(img) => {
            if (!intrinsic) {
              setIntrinsic({ w: img.naturalWidth, h: img.naturalHeight });
            }
          }}
        />
      ) : null}

      {/* Labels from content, aligned to actual rendered image rect */}
      <div
        className="absolute"
        style={
          contentRect
            ? {
                top: contentRect.top,
                left: contentRect.left,
                width: contentRect.width,
                height: contentRect.height
              }
            : { inset: 0 }
        }
      >
        {(labels ?? defaultLabels).map((l) => {
          const rawValue = values[l.key];
          return (
            <Label key={l.id} style={l.style}>
              {l.title}
              <Value>
                {rawValue}
                {unitLabel}
              </Value>
            </Label>
          );
        })}
      </div>
    </div>
  );
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="absolute text-neutral-500 text-lg md:text-xl lg:text-2xl font-light leading-tight"
      style={style}
    >
      {children}
    </div>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return <div className="text-neutral-500 text-base md:text-lg lg:text-xl">{children}</div>;
}

// Fallback labels if none provided by content
const defaultLabels: LabelSpec[] = [
  { id: "shoulder", title: "Shoulder", key: "shoulder", style: { top: "2%", left: "50%", transform: "translateX(-50%)" } },
  { id: "chest", title: "Chest", key: "chest", style: { top: "47%", left: "50%", transform: "translateX(-50%)" } },
  { id: "body-left", title: "Body", key: "body", style: { top: "58%", left: "6%", textAlign: "left" } },
  { id: "body-right", title: "Body", key: "body", style: { top: "58%", right: "6%", textAlign: "right" } },
  { id: "hem", title: "Hem", key: "hem", style: { bottom: "3%", left: "50%", transform: "translateX(-50%)" } }
];


