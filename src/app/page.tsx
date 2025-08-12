// src/app/page.tsx (server component)
import HeaderSection from '@/components/home/HeaderSection';
import HeroImage from '@/components/home/HeroImage';
import { getProduct } from '@/lib/shopify';
import ProductCard from '@/components/home/ProductCard';
import type { Product, Image as ShopifyImage } from '@/lib/shopify/types';

type MediaImageRef = { image: ShopifyImage };

function getCardImage(product?: Product): ShopifyImage | null {
  const ref = product?.productCardPhoto?.reference as MediaImageRef | undefined;
  const refImage = ref?.image;
  return refImage ?? product?.featuredImage ?? null;
}


export default async function HomePage() {

  // this is hard coded right now, obviously if we have multiple products, and we want to be more safe with name change, 
  // we should query shopify to get product handle, then we can use the getCardImage function to get the image for each product.
  const [avril, lyon] = await Promise.all([getProduct('avril'), getProduct('lyon')]);
  const avrilImg = getCardImage(avril);
  const lyonImg = getCardImage(lyon);

  return (
    <main className="flex min-h-screen flex-col">
      <HeaderSection />
      {/* {cardImage && (
        <HeroImage src={cardImage.url} alt={cardImage.altText || 'Avril'} />
      )} */}
      <HeroImage 
        src="/images/home/hero_image.png" 
        alt="Makkuro Collection Hero"
      />
      <p className="px-4 pb-12 lg:pb-16 w-full max-w-2xl mx-auto text-lg font-light text-black leading-relaxed tracking-[-0.02em] text-center">
      the makkuro collection is like the calm within a world that moves way too fast. Welcome and enjoy it. Yes this is just some random text so I can easily see how this looks on the website.
      </p>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full px-4 pb-12">
        {avril && avrilImg && (
          <ProductCard
            title={avril.title}
            href={`/products/${avril.handle}`}
            src={avrilImg.url}
            alt={avrilImg.altText || avril.title}
          />
        )}
        {lyon && lyonImg && (
          <ProductCard
            title={lyon.title}
            href={`/products/${lyon.handle}`}
            src={lyonImg.url}
            alt={lyonImg.altText || lyon.title}
          />
        )}
      </section>
    </main>
  );
}