"use client";

import { useEffect } from 'react';
import Image from 'next/image';

// All images that might be loaded in dropdowns/sections
const PRELOAD_IMAGES = [
  // Composition icons
  '/images/composition_icons/alpaca.png',
  '/images/composition_icons/wool.png', 
  '/images/composition_icons/nylon.png',
  '/images/composition_icons/spandex.png',
  '/images/composition_icons/polyester.png',
  
  // Size charts
  '/images/size-charts/avril_size_chart.png',
];

export default function ImagePreloader() {
  useEffect(() => {
    // Preload all images using Next.js Image preload
    PRELOAD_IMAGES.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Cleanup function to remove preload links
    return () => {
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="image"]');
      preloadLinks.forEach(link => {
        if (PRELOAD_IMAGES.includes(link.getAttribute('href') || '')) {
          link.remove();
        }
      });
    };
  }, []);

  return (
    <>
      {/* Hidden images for Next.js to optimize */}
      <div style={{ display: 'none' }}>
        {PRELOAD_IMAGES.map((src) => (
          <Image
            key={src}
            src={src}
            alt="preload"
            width={1}
            height={1}
            priority={true}
          />
        ))}
      </div>
    </>
  );
}
