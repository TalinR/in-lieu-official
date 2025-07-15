'use client';

import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type CartButtonProps = {
  onClick: () => void;
  quantity?: number;
};

const CartButton = ({ onClick, quantity }: CartButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open cart"
      className={clsx(
        'flex h-10 w-13 items-center justify-center text-black',
        // --- Updated Styles ---
        'rounded-l-[20px]', // Left side: 20px (half the height = 40px/2)
        'rounded-r-[8px]', // Right side: 8px
        'bg-[#FFFFFF17] backdrop-blur-sm', // 9% opacity white + background blur
        'shadow-figma-button' // Your custom shadow from tailwind.config.ts
      )}
    >
      <ShoppingBagIcon className="h-6 w-6 translate-x-[2px]" />
      {quantity && quantity > 0 ? (
        <div className="absolute right-0 top-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
          {quantity}
        </div>
      ) : null}
    </button>
  );
};

export default CartButton; 