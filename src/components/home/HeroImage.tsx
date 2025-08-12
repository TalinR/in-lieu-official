'use client';

import React from 'react';
import Image from 'next/image';

interface HeroImageProps {
  src: string;
  alt: string;
}

const HeroImage = ({ 
  src, 
  alt 
}: HeroImageProps) => {
  return (
    <div className="px-4 pb-8 lg:pb-12 lg:pt-3 w-full max-w-xl mx-auto">
      <div className="relative overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1024px"
          priority
        />
      </div>
    </div>
  );
};

export default HeroImage;
