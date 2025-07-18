'use client';

import React, { useEffect, useRef } from 'react';
import ResponsiveSafeImage from './ResponsiveSafeImage';
import PageLinks from './PageLinks';
import SocialSelection from './SocialSelection';
import { usePathname } from 'next/navigation';
import { useSections } from '../SectionsContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuModalProps {
  isOpen: boolean;
  onLinkClick?: () => void;
}

const MenuModal = ({ isOpen, onLinkClick }: MenuModalProps) => {
  const currentPath = usePathname();
  const { sections, setSections } = useSections();
  
  // Store the original sections when modal opens
  const originalSectionsRef = useRef<typeof sections>([]);

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

  // Define menu-specific sections
  const menuSections = [
    { id: 'menu', name: 'menu' },

  ];

  useEffect(() => {
    if (isOpen) {
      // Save current sections and set menu sections
      originalSectionsRef.current = [...sections];
      setSections(menuSections);
    } else {
      // Restore original sections when modal closes
      if (originalSectionsRef.current.length > 0) {
        setSections(originalSectionsRef.current);
        originalSectionsRef.current = []; // Clear the ref after restoration
      }
    }
    
    // Cleanup function: restore sections if component unmounts while modal is open
    return () => {
      if (isOpen && originalSectionsRef.current.length > 0) {
        setSections(originalSectionsRef.current);
      }
    };
  }, [isOpen, setSections]); // sections dependency removed to prevent infinite loops

  if (!isOpen) {
    return null;
  }

  return (
    <div id="menu" className="fixed inset-0 z-40 flex flex-col bg-white p-6 pb-16 lg:flex-row">
      {/* 
        Image Section 
        - Mobile: Takes up the remaining space (flex-1)
        - Desktop: Takes up 3/5 of the width
      */}
      <div className="flex-1 lg:w-3/5">
        <ResponsiveSafeImage
          src="/images/test_image.png"
          alt="A beautiful landscape"
          imageClassName="transition-opacity duration-1000 ease-in-out"
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

        <div className="my-10">
          <PageLinks pages={pages} currentPath={currentPath} onLinkClick={onLinkClick} />
        </div>

        <hr className="border-t border-gray-300 w-full lg:hidden" />

        <div className="my-10">
          <SocialSelection />
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
