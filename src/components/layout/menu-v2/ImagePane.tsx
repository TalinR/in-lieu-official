// src/components/layout/menu-v2/ImagePane.tsx
import React from 'react';
import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
};

export default function ImagePane({ src, alt }: Props) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-contain"
        priority={false}
      />
    </div>
  );
}