'use client';

import React, { useEffect, useRef } from 'react';
import ResponsiveSafeImage from './ResponsiveSafeImage';
import PageLinks from './PageLinks';
import SocialSelection from './SocialSelection';
import { usePathname } from 'next/navigation';
import { useSections } from '../SectionsContext';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

// ------------------  animation definitions  ------------------
const container: Variants = {
  hidden: {},
  show: {
    transition: {           // children fire in sequence
      staggerChildren: 0.25 // 0.25 s between siblings – tweak as you like
    }
  },
  exit: {
    opacity: 0,
    transition: { when: 'afterChildren' } // children leave first
  }
};

const item: Variants = {               // re-use everywhere
  hidden: { opacity: 0, y: 30 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [1, 1, 1, 1] } },
  exit:  { opacity: 0, y: 20, transition: { duration: 0.2 } }
};
// -------------------------------------------------------------

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
      name: "home", 
      description: "lookbook and about the collection", 
      href: "/" 
      },
      { 
        name: "avril", 
        description: "experience the all new alpacca avery", 
        href: "/products/avril" 
      },
      { 
        name: "lyon", 
        description: "bringing back a classic", 
        href: "/products/lyon" 
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
    <AnimatePresence>
      {isOpen && (                                         
        <motion.div
          id="menu"
          variants={container}   // parent gets the container variant
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-40 flex flex-col bg-white p-6 pb-16 landscape:lg:flex-row landscape:flex-row landscape:pl-10 landscape:pr-10 landscape:pb-20 landscape:pt-10 landscape:lg:px-30 landscape:lg:py-30 xl:px-40 xl:py-40"
        >
          {/*  Image div
            This is the top div, containing the image and product tags
            Animation: have the image animating first */}
          <motion.div variants={item} className="flex-1 landscape:lg:w-3/5">
            <ResponsiveSafeImage
              src="/images/test_image.png"
              alt="In lieu official"
              imageClassName="transition-opacity"
            />
          </motion.div>

          {/*  this is where all the PageLinks, and logos will be
            On mobile, we'll have this directly underneath the image div
            On desktop, we'll have this on the right side of the screen */}
          <motion.div variants={container} className="flex flex-col 
                                                      landscape:w-3/5 landscape:pl-10 
                                                      landscape:lg:w-2/5 landscape:lg:pl-10">
            {/* Links
            Animation: */}
            <motion.div variants={item} className="my-10 landscape:my-2 landscape:lg:my-3">
              <PageLinks pages={pages} currentPath={currentPath} onLinkClick={onLinkClick} />
            </motion.div>

            {/* second “slot” → both inner elements run in parallel */}
            <motion.div variants={item} className="landscape:mt-auto landscape:lg:mt-auto">
              <hr className="border-t border-gray-300 w-full landscape:hidden landscape:lg:hidden" />
              <div className="my-10 landscape:my-2 landscape:lg:my-0">
                <SocialSelection onLinkClick={onLinkClick} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuModal;
