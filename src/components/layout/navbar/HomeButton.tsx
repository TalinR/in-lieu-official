'use client';

import React from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';

const HomeButton = () => {
  return (
    <Link href="/" className="relative h-13 w-13 lg:h-11 lg:w-11">
      <div
        className={clsx(
          'absolute inset-0 flex items-center justify-center rounded-full text-black',
          'bg-[#FFFFFF17] backdrop-blur-sm',
          'shadow-figma-button',
        )}
      >
        <HomeIcon className="h-8 w-8 lg:h-6 lg:w-6" />
      </div>
    </Link>
  );
};

export default HomeButton;