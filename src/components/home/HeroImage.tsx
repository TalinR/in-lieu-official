'use client';

import React from 'react';
import Image from 'next/image';

interface HeroImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const HeroImage = ({ 
  src, 
  alt,
  width,
  height 
}: HeroImageProps) => {
  return (
    <div className="px-4 pb-8 lg:pb-12 lg:pt-3 w-full lg:w-1/3 mx-auto">
      <div className="relative overflow-hidden aspect-[4/5] lg:aspect-[3/4] flex items-center justify-center">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1024px"
          priority
        />
      </div>
    </div>
  );
};

export default HeroImage;
