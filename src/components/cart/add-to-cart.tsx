'use client';

import clsx from 'clsx';
import { addItem } from '@/components/cart/actions';
import { useProduct } from '@/components/product/product-context';
import { Product, ProductVariant } from '@/lib/shopify/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';
import Price from '@/components/price';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  price
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  price: { amount: string; currencyCode: string };
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-between rounded-lg bg-black px-5 py-3 text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  const Label = (
    <span className="lowercase font-light tracking-normal">add to cart</span>
  );
  const PriceEl = (
    <Price
      amount={price.amount}
      currencyCode={price.currencyCode}
      className="font-light text-white"
      showSymbol={false}
      fractionDigits={0}
    />
  );

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        <span className="lowercase font-light">out of stock</span>
        {PriceEl}
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        {Label}
        {PriceEl}
      </button>
    );
  }

  return (
    <button aria-label="Add to cart" className={clsx(buttonClasses, 'hover:opacity-90')}>
      {Label}
      {PriceEl}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )!;
  const displayPrice =
    variant?.price ||
    (variants.length === 1 ? variants[0].price : product.priceRange.minVariantPrice);

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        price={{ amount: displayPrice.amount, currencyCode: displayPrice.currencyCode }}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
