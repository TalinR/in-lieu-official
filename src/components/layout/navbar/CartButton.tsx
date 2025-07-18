'use client';

import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type CartButtonProps = {
  onClick: () => void;
  quantity?: number;
};

const CartButton = ({ onClick, quantity = 1 }: CartButtonProps) => {
  return (
    // Use a relative container to position the button and the badge
    <div className="relative h-10 w-10">
      <button
        onClick={onClick}
        aria-label="Open cart"
        className={clsx(
          'absolute inset-0 flex items-center justify-center rounded-full text-black', // Fill the container
          'bg-[#FFFFFF17] backdrop-blur-sm',
          'shadow-figma-button',
        )}
      >
        <ShoppingBagIcon className="h-6 w-6" />
      </button>

      <div
        className={clsx(
          'pointer-events-none absolute right-0 top-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-medium text-white',
          'bg-[#FFFFFF17] backdrop-blur-sm', // Same transparency styles
          'shadow-figma-button'
        )}
      >
        {quantity}
      </div>
    </div>
  );
};

export default CartButton;