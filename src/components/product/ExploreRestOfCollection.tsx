import Image from 'next/image';
import Link from 'next/link';
import { getProduct } from '@/lib/shopify';
import type { Product } from '@/lib/shopify/types';
import { RichText } from "@/lib/shopify/richtext";

interface ExploreRestOfCollectionProps {
  product: Product;
}

/**
 * Component to display the complementary product in the collection
 * Shows "Avril" when viewing "Lyon" and vice versa
 */
export default async function ExploreRestOfCollection({ product }: ExploreRestOfCollectionProps) {
  // Determine which product to show based on current product
  const getComplementaryProductHandle = (currentProduct: Product): string => {
    const currentTitle = currentProduct.title.toLowerCase();
    if (currentTitle.includes('lyon')) {
      return 'avril';
    } else if (currentTitle.includes('avril')) {
      return 'lyon';
    }
    // Fallback - you can adjust this logic based on your needs
    return 'avril';
  };

  const complementaryHandle = getComplementaryProductHandle(product);
  const complementaryProduct = await getProduct(complementaryHandle);

  if (!complementaryProduct) {
    return null;
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 pt-8">
      {/* Section title */}
      <h2 className="text-center text-lg lg:text-2xl font-light tracking-wide mb-8 lg:mb-10">
        explore the rest of the collection
      </h2>
      
      {/* Two-column layout */}
      <div className="flex items-stretch">
        {/* Left column - Image */}
        <div className="w-1/2 flex justify-end pr-2">
          <div className="w-4/5 lg:w-3/5">
            <Link href={`/products/${complementaryProduct.handle}`}>
              {complementaryProduct.exploreTheRestImage?.reference && 
               'image' in complementaryProduct.exploreTheRestImage.reference &&
               complementaryProduct.exploreTheRestImage.reference.image ? (
                <Image
                  src={complementaryProduct.exploreTheRestImage.reference.image.url}
                  alt={complementaryProduct.exploreTheRestImage.reference.image.altText || complementaryProduct.title}
                  width={complementaryProduct.exploreTheRestImage.reference.image.width}
                  height={complementaryProduct.exploreTheRestImage.reference.image.height}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 40vw, 20vw"
                />
              ) : null}
            </Link>
          </div>
        </div>
        
        {/* Right column - Text */}
        <div className="w-1/2 flex flex-col justify-center pl-2">
          <Link href={`/products/${complementaryProduct.handle}`} className="group">
            <h3 className="text-lg lg:text-2xl font-light mb-0 group-hover:opacity-70 transition-opacity">
              {complementaryProduct.title}
            </h3>
            <p className="text-xs lg:text-lg font-light text-neutral-700 mb-1 lg:mb-2 leading-relaxed">
              {complementaryProduct.description}
            </p>
            <div className="hidden lg:block text-sm font-light text-neutral-700 mb-3 pr-12">
            <RichText value={complementaryProduct.longDescription.value} />
            </div>
            <span className="text-xs lg:text-lg font-light text-neutral-500 group-hover:opacity-70 transition-opacity">
              explore
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
