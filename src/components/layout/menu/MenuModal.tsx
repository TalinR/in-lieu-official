'use client';

import React from 'react';
import ResponsiveSafeImage from './ResponsiveSafeImage';


interface MenuModalProps {
  isOpen: boolean;
}

const MenuModal = ({ isOpen }: MenuModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white p-6 pb-30 lg:flex-row">
      {/* 
        Image Section 
        - Mobile: Takes up the remaining space (flex-1)
        - Desktop: Takes up 3/5 of the width
      */}
      <div className="flex-1 lg:w-3/5">
      <ResponsiveSafeImage
          src="/images/test_image.png"
          alt="A beautiful landscape"
          // Optional: customize the safe area. 
          // Defaults to x: 0.3 (30%) and y: 0.5 (50%) if not provided.
          // safeArea={{ x: 0.4, y: 0.6 }} 
        />
      </div>
      {/* 
        Content Section
        - Mobile: Stacks below the image
        - Desktop: Takes up 2/5 of the width and arranges content vertically
      */}
      <div className="flex flex-col lg:w-2/5" >
        <h1 className="text-2xl font-bold text-center">Menu</h1>


      </div>
    </div>
  );
};

export default MenuModal;
