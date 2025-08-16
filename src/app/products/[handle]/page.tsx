import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/shopify';
import { ProductProvider } from '@/components/product/product-context';
import { HIDDEN_PRODUCT_TAG } from '@/lib/constants';
import Hero from '@/components/product/Hero';
import Gallery from '@/components/product/Gallery';
import Copy from '@/components/product/Copy';
import PurchasePanel from '@/components/product/PurchasePanel';
import Info from '@/components/product/Info';
import AdditionalProductImages from '@/components/product/AdditionalProductImages';
import ExploreRestOfCollection from '@/components/product/ExploreRestOfCollection';
import ImagePreloader from '@/components/ImagePreloader';
import ProductPagePrefetcher from '@/components/ProductPagePrefetcher';


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
      <ImagePreloader />
      <ProductPagePrefetcher />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="pb-10 lg:pb-0">
      <Hero
        copy={<Copy product={product} />}
        gallery={<Gallery product={product} />}
        purchasePanel={<PurchasePanel product={product} />}
      />
      <Info product={product} />
      <AdditionalProductImages product={product} />
      <ExploreRestOfCollection product={product} />
      </div>
    </ProductProvider>
  );
}
