import Image from 'next/image';
import { getProduct } from '@/lib/shopify';
import type { Image as ShopifyImage } from '@/lib/shopify/types';

interface MediaImageNode {
  image: ShopifyImage;
}

interface MetafieldReference {
  edges?: Array<{
    node?: unknown;
  }> | null;
}

/**
 * Type guard to check if a node is a valid MediaImage with required image properties
 */
function isMediaImageNode(node: unknown): node is MediaImageNode {
  if (!node || typeof node !== 'object' || !('image' in node)) {
    return false;
  }
  
  const image = (node as { image?: unknown }).image;
  if (!image || typeof image !== 'object') {
    return false;
  }
  
  const { url, width, height } = image as Record<string, unknown>;
  return (
    typeof url === 'string' &&
    typeof width === 'number' &&
    typeof height === 'number'
  );
}

/**
 * Extracts valid images from lookBookPhotosUseAvril metafield references
 */
function extractLookbookImages(references: MetafieldReference | null | undefined): ShopifyImage[] {
  if (!references?.edges) {
    return [];
  }

  return references.edges
    .map((edge) => edge?.node)
    .filter(isMediaImageNode)
    .map((node) => node.image);
}

/**
 * Lookbook page component that displays images from the avril product's lookBookPhotosUseAvril metafield
 */
export default async function LookbookPage() {
  // Fetch the "avril" product
  const avrilProduct = await getProduct('Avril');

  if (!avrilProduct) {
    return (
      <div className="w-full max-w-[3000px] mx-auto px-4 lg:px-4 pt-4">
        <h1 className="text-2xl font-bold mb-8">Lookbook</h1>
        <p className="text-gray-600">Could not find the avril product or lookbook images.</p>
      </div>
    );
  }

  const lookbookImages = extractLookbookImages(
    avrilProduct.lookBookPhotosUseAvril?.references
  );

  if (lookbookImages.length === 0) {
    return (
      <div className="w-full max-w-[3000px] mx-auto px-4 lg:px-4 pt-4">
      </div>
    );
  }

  return (
    <div className="w-full max-w-[3000px] mx-auto px-4 lg:px-4 pt-4 lg:mt-20">
      <section className="w-full" aria-label="Lookbook images">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-4">
          {lookbookImages.map((image, index) => (
            <div key={`lookbook-image-${index}`} className="relative">
              <Image
                src={image.url}
                alt={image.altText || `Lookbook image ${index + 1}`}
                width={image.width}
                height={image.height}
                className="w-full h-auto rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 2} // Prioritize loading first two images
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
