// 'use client';

import React from 'react';
// import HeaderSection from '@/components/home/HeaderSection';
// import HeroImage from '@/components/home/HeroImage';
// import { useSections } from '@/components/layout/SectionsContext';
import Image from "next/image";
import type { Product } from "@/lib/shopify/types";

// const HomePage = () => {
//   // const { setSections } = useSections();

//   // useEffect(() => {
//   //   // Set sections for the homepage when component mounts
//   //   setSections([
//   //     { id: 'makurro', name: 'makurro' },
//   //     { id: 'lookbook', name: 'lookbook' },
//   //     { id: 'about', name: 'about' },
//   //     { id: 'shop', name: 'shop' },
//   //   ]);

//   //   // Cleanup: clear sections when component unmounts (optional)
//   //   return () => {
//   //     // Note: We might not want to clear on unmount if we want sections 
//   //     // to persist during navigation. This will be refined in later steps.
//   //   };
//   // }, [setSections]);

//   return (
//     <main className="flex min-h-screen flex-col">
//       <HeaderSection />
//       <HeroImage 
//         src="/images/home/hero_image.png" 
//         alt="Makkuro Collection Hero"
//       />
      
//       {/* Collection Description */}
//       <p className="px-4 pb-12 lg:pb-16 w-full max-w-2xl mx-auto text-lg font-light text-black leading-relaxed tracking-[-0.02em] text-center">
//         the makkuro collection is like the calm within a world that moves way too fast. Welcome and enjoy it. Yes this is just some random text so I can easily see how this looks on the website.
//       </p>
//     </main>
//   );
// };

// export default HomePage;


// in-lieu-official/src/app/page.tsx
import HeaderSection from '@/components/home/HeaderSection';
import HeroImage from '@/components/home/HeroImage';
import { getProduct } from '@/lib/shopify';

export default async function HomePage() {
  const product = await getProduct('avril');
  const cardImage =
    (product?.productCardPhoto?.reference as any)?.image ??
    product?.featuredImage;

  return (
    <main className="flex min-h-screen flex-col">
      <HeaderSection />
      {cardImage && (
        <HeroImage
          src={cardImage.url}
          alt={cardImage.altText || 'Avril'}
        />
      )}
      <p className="px-4 pb-12 lg:pb-16 w-full max-w-2xl mx-auto text-lg font-light text-black leading-relaxed tracking-[-0.02em] text-center">
//         the makkuro collection is like the calm within a world that moves way too fast. Welcome and enjoy it. Yes this is just some random text so I can easily see how this looks on the website.
//       </p>
    </main>
  );
}


