'use client';

import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useCart } from '@/components/cart/cart-context';

type CartButtonProps = {
  onClick: () => void;
};

const CartButton = ({ onClick }: CartButtonProps) => {
  const { cart } = useCart();
  const quantity = cart?.totalQuantity || 0;

  return (
    <div className="relative h-13 w-13 lg:h-11 lg:w-11">
      <button
        onClick={onClick}
        aria-label="Open cart"
        className={clsx(
          'absolute inset-0 flex items-center justify-center rounded-full text-black',
          'bg-[#FFFFFF17] backdrop-blur-sm',
          'shadow-figma-button',
        )}
      >
        <ShoppingBagIcon className="h-8 w-8 lg:h-6 lg:w-6" />
      </button>

      {quantity > 0 && (
        <div
          className={clsx(
            'pointer-events-none absolute right-0 top-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-medium text-white',
            'bg-[#000000] backdrop-blur-sm',
            // 'shadow-figma-button'
          )}
        >
          {quantity}
        </div>
      )}
    </div>
  );
};

export default CartButton;