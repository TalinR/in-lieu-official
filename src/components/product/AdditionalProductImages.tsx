import Image from 'next/image';
import type { Image as ShopifyImage, Product } from '@/lib/shopify/types';

interface AdditionalProductImagesProps {
  product: Product;
}

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
 * Extracts valid images from Shopify metafield references
 */
function extractAdditionalImages(references: MetafieldReference | null | undefined): ShopifyImage[] {
  if (!references?.edges) {
    return [];
  }

  return references.edges
    .map((edge) => edge?.node)
    .filter(isMediaImageNode)
    .map((node) => node.image);
}

/**
 * Component to display additional product images in a responsive grid
 */
export default function AdditionalProductImages({ product }: AdditionalProductImagesProps) {
  const additionalImages = extractAdditionalImages(
    product.productAdditionalPhotosAtBottom?.references
  );

  if (additionalImages.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-[3000px] mx-auto px-4 lg:px-4 pt-4" aria-label="Additional product images">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4">
        {additionalImages.map((image, index) => (
          <div key={`additional-image-${index}`} className="relative">
            <Image
              src={image.url}
              alt={image.altText || `${product.title} - additional view ${index + 1}`}
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
  );
}
