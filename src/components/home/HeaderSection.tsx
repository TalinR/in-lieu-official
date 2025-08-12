'use client';

import React from 'react';
import Image from 'next/image';

const HeaderSection = () => {
  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex flex-col items-center pt-6 pb-6 px-4">
          {/* Brand Logo */}
          <div className="mb-1">
            <Image 
              src="/images/logo/black_logo.svg" 
              alt="in lieu" 
              width={120}
              height={48}
              className="h-12 w-auto" 
              priority
            />
          </div>
          
          {/* Collection Title */}
          <h1 className="text-2xl font-light text-center tracking-[-0.02em]">
            makkuro collection
          </h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="flex justify-center pt-8 pb-8">
          <h1 className="text-3xl font-light tracking-[-0.02em]">
            makkuro collection
          </h1>
        </div>
      </div>
    </>
  );
};

export default HeaderSection;
