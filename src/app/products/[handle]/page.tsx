import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/shopify';
import { ProductProvider } from '@/components/product/product-context';
import { HIDDEN_PRODUCT_TAG } from '@/lib/constants';
import { AddToCart } from '@/components/cart/add-to-cart';
import Price from '@/components/price';
import Image from 'next/image';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <main className="mx-auto max-w-7xl px-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No image available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Price */}
            <div className="text-2xl font-semibold text-gray-900">
              {product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount ? (
                <Price
                  amount={product.priceRange.minVariantPrice.amount}
                  currencyCode={product.priceRange.minVariantPrice.currencyCode}
                />
              ) : (
                <span>
                  <Price
                    amount={product.priceRange.minVariantPrice.amount}
                    currencyCode={product.priceRange.minVariantPrice.currencyCode}
                    className="inline"
                  />
                  {' - '}
                  <Price
                    amount={product.priceRange.maxVariantPrice.amount}
                    currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                    className="inline"
                  />
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </div>

            {/* Availability */}
            <div className="text-sm">
              {product.availableForSale ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="mt-6">
              <AddToCart product={product} />
            </div>
          </div>
        </div>
      </main>
    </ProductProvider>
  );
}
