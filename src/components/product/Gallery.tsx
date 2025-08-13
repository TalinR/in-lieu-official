"use client";

import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { Product } from "@/lib/shopify/types";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function Gallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const allImages = images.length > 0 ? images : product.featuredImage ? [product.featuredImage] : [];

  if (allImages.length === 0) {
    return (
      <div className="w-full">
        {/* Mobile: No image */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden rounded-3xl bg-[#EDEDED] aspect-[2/2.32]">
            <div className="flex h-full w-full items-center justify-center text-neutral-500">
              No image
            </div>
          </div>
        </div>
        
        {/* Desktop: No image */}
        <div className="hidden lg:block">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-100 aspect-[2/2.32]">
            <div className="flex h-full w-full items-center justify-center text-neutral-500">
              No image
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Single image - no need for carousel
  if (allImages.length === 1) {
    return (
      <div className="w-full">
        {/* Mobile: Single image */}
        <div className="lg:hidden">
          <div className="relative overflow-hidden rounded-3xl bg-[#EDEDED] aspect-[2/2.32]">
            <Image
              src={allImages[0].url}
              alt={allImages[0].altText || product.title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
        
        {/* Desktop: Single image */}
        <div className="hidden lg:block">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-100">
            <Image
              src={allImages[0].url}
              alt={allImages[0].altText || product.title}
              width={allImages[0].width || 2000}
              height={allImages[0].height || 2000}
              className="h-auto w-full object-contain"
              sizes="(min-width:1024px) 60vw"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile: Fixed Container with Swiper Inside */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-3xl bg-[#EDEDED] aspect-[2/2.32]">
          <Swiper
            modules={[Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            className="h-full w-full !pb-8"
          >
            {allImages.map((img, index) => (
              <SwiperSlide key={img.url} className="h-full w-full">
                <Image
                  src={img.url}
                  alt={img.altText || product.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={index === 0}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Desktop: vertically stacked images */}
      <div className="hidden lg:block">
        <div className="flex flex-col gap-6">
          {allImages.map((img) => (
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


