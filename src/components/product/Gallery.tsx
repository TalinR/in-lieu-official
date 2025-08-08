"use client";

import Image from "next/image";
import React from "react";
import type { Product } from "@/lib/shopify/types";

export default function Gallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const featured = product.featuredImage ?? images[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-100 aspect-[2/2.22]">
      {featured ? (
        <Image
          src={featured.url}
          alt={featured.altText || product.title}
          fill
          className="object-contain"
          sizes="(min-width:1024px) 60vw, 100vw"
          priority
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-neutral-500">
          No image
        </div>
      )}
    </div>
  );
}


