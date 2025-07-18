'use client';

import React from 'react';
import ResponsiveSafeImage from './ResponsiveSafeImage';
import PageLinks from './PageLinks';
import SocialSelection from './SocialSelection';
import { usePathname } from 'next/navigation';

interface MenuModalProps {
  isOpen: boolean;
  onLinkClick?: () => void;
}

const MenuModal = ({ isOpen, onLinkClick }: MenuModalProps) => {
  const currentPath = usePathname();

  if (!isOpen) {
    return null;
  }

  // Sample page data
  const pages = [
    { 
      name: "collection", 
      description: "makurro game, lookbook and about the collection", 
      href: "/" 
    },
    { 
      name: "delivery and returns", 
      description: "all the boring stuff that you dont care about", 
      href: "/delivery" 
    }
  ];

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
        {/* <h1 className="text-2xl font-bold text-center">Menu</h1> */}

        <div className="mt-4">
          <PageLinks pages={pages} currentPath={currentPath} onLinkClick={onLinkClick} />
        </div>

        <hr className="border-t border-gray-300 w-full my-8 lg:hidden" />

        <div>
          <SocialSelection />
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
