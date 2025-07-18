'use client';

import React from 'react';
import { Bars2Icon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type MenuButtonProps = {
  onClick: () => void;
};

const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open menu"
      className={clsx(
        'flex h-10 w-10 items-center justify-center text-black',
        'rounded-full',
        'bg-[#FFFFFF17] backdrop-blur-sm', // 9% opacity white + background blur
        'shadow-figma-button' // Your custom shadow from tailwind.config.ts
      )}
    >
      <Bars2Icon className="h-6 w-6" />
    </button>
  );
};

export default MenuButton; 