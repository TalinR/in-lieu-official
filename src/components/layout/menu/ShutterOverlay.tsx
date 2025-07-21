'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A simple hook to get window dimensions.
// In a real app, you might want to debounce this.
const useWindowSize = () => {
  const [size, setSize] = React.useState([0, 0]);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

interface ShutterOverlayProps {
  isOpen: boolean;
  targetRect: { x: number; y: number; width: number; height: number; } | null;
  onAnimationComplete?: () => void;
}

const ShutterOverlay = ({ isOpen, targetRect, onAnimationComplete }: ShutterOverlayProps) => {
  const [windowWidth, windowHeight] = useWindowSize();

  const transition = { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const };

  // This will fire when the main container's children have finished animating.
  const handleAnimationComplete = () => {
    if (isOpen && onAnimationComplete) {
      onAnimationComplete();
    }
  };
  
  const shutterVariants = {
    open: {
      // This is a dummy property to animate on the container.
      // The real animations are on the children.
      opacity: 1, 
      transition: { when: "beforeChildren" } 
    },
    closed: {
      opacity: 0,
      transition: { when: "afterChildren" }
    },
  };

  return (
    <AnimatePresence>
      {isOpen && targetRect && windowWidth > 0 && (
        <motion.div
          className="pointer-events-none"
          variants={shutterVariants}
          initial="closed"
          animate="open"
          exit="closed"
          onAnimationComplete={handleAnimationComplete}
        >
          {/* Top Shutter */}
          <motion.div
            className="fixed top-0 left-0 w-full bg-black z-50"
            initial={{ height: 0 }}
            animate={{ height: targetRect.y }}
            exit={{ height: 0 }}
            transition={transition}
          />

          {/* Bottom Shutter */}
          <motion.div
            className="fixed bottom-0 left-0 w-full bg-black z-50"
            initial={{ height: 0 }}
            animate={{ height: windowHeight - (targetRect.y + targetRect.height) }}
            exit={{ height: 0 }}
            transition={transition}
          />

          {/* Left Shutter */}
          <motion.div
            className="fixed left-0 bg-black z-50"
            style={{ top: targetRect.y, height: targetRect.height }}
            initial={{ width: 0 }}
            animate={{ width: targetRect.x }}
            exit={{ width: 0 }}
            transition={transition}
          />
          
          {/* Right Shutter */}
          <motion.div
            className="fixed right-0 bg-black z-50"
            style={{ top: targetRect.y, height: targetRect.height }}
            initial={{ width: 0 }}
            animate={{ width: windowWidth - (targetRect.x + targetRect.width) }}
            exit={{ width: 0 }}
            transition={transition}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShutterOverlay;
