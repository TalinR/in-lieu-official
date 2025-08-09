"use client";

import Image from "next/image";
import React from "react";
import type { Product } from "@/lib/shopify/types";

export default function Gallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const featured = product.featuredImage ?? images[0];

  return (
    <div>
      {/* Mobile: single image aspect container (swipe behavior may be added outside). */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-100 aspect-[2/2.22] lg:hidden">
        {featured ? (
          <Image
            src={featured.url}
            alt={featured.altText || product.title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-500">
            No image
          </div>
        )}
      </div>

      {/* Desktop: vertically stacked images */}
      <div className="hidden lg:block">
        <div className="flex flex-col gap-6">
          {(images.length > 0 ? images : featured ? [featured] : []).map((img) => (
            <div key={img.url} className="relative overflow-hidden rounded-3xl bg-neutral-100">
              <Image
                src={img.url}
                alt={img.altText || product.title}
                width={img.width || 2000}
                height={img.height || 2000}
                className="h-auto w-full object-contain"
                sizes="(min-width:1024px) 60vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


