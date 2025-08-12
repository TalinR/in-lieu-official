'use server';

import { TAGS } from '@/lib/constants';
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart
} from '@/lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  _prevState: unknown,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    // Attempt to add to an existing cart first.
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
  } catch {
    /**
     * The most common reason the previous call fails is because the user does
     * not have a `cartId` cookie yet (e.g. first-time add-to-cart). We create a
     * fresh cart, set the cookie, and retry.
     */
    try {
      const newCart = await createCart();
      (await cookies()).set('cartId', newCart.id!, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
      await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    } catch {
      return 'Error adding item to cart';
    }
  }

  // If we reach here the cart was updated successfully.
  revalidateTag(TAGS.cart);
}

export async function removeItem(_prevState: unknown, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  _prevState: unknown,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  const cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  const cart = await createCart();
  (await cookies()).set('cartId', cart.id!, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
}
