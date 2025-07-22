"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useAnimation } from "framer-motion";
import { useSections } from "./SectionsContext";

interface CachedSectionData {
  element: HTMLElement;
  linkElement: HTMLAnchorElement;
}

interface IndicatorState {
  bottom: number;
  height: number;
  activeSectionIndex: number;
}

/**
 * A fixed-position navigation component that displays links to page sections.
 * It features a vertical indicator bar that smoothly tracks the user's scroll
 * progress through the sections. Uses Framer Motion's useScroll for smooth animations.
 * @returns {React.ReactElement | null} The rendered navigation element or null if no sections.
 */
const SectionLinksFramerMotion = () => {
  const { sections, isLoading } = useSections();
  const [indicatorState, setIndicatorState] = useState<IndicatorState>({
    bottom: 0,
    height: 0,
    activeSectionIndex: 0,
  });
  
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const cachedSectionsRef = useRef<Map<string, CachedSectionData>>(new Map());
  const prevSectionsRef = useRef<typeof sections>([]);

  // Framer Motion scroll tracking
  const { scrollY } = useScroll();
  
  // Motion values for smooth indicator animation
  const indicatorBottom = useMotionValue(0);
  const indicatorHeight = useMotionValue(0);
  const indicatorControls = useAnimation();

  // Cache section elements when sections change
  const updateSectionCache = useCallback(() => {
    const newCache = new Map<string, CachedSectionData>();
    
    sections.forEach((section, index) => {
      const element = document.getElementById(section.id);
      const linkElement = linkRefs.current[index];
      
      if (element && linkElement) {
        newCache.set(section.id, { element, linkElement });
      }
    });
    
    cachedSectionsRef.current = newCache;
  }, [sections]);

  // Calculate which section is currently in view
  const getCurrentSectionIndex = useCallback((scrollYValue: number): number => {
    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionData = cachedSectionsRef.current.get(sections[i].id);
      if (sectionData && sectionData.element.offsetTop <= scrollYValue + 1) {
        return i;
      }
    }
    return 0;
  }, [sections]);

  // Calculate scroll progress within current section
  const calculateScrollProgress = useCallback((
    currentIndex: number, 
    scrollYValue: number
  ): number => {
    if (currentIndex >= sections.length - 1) return 0;

    const currentSectionData = cachedSectionsRef.current.get(sections[currentIndex].id);
    const nextSectionData = cachedSectionsRef.current.get(sections[currentIndex + 1].id);
    
    if (!currentSectionData || !nextSectionData) return 0;

    const sectionStart = currentSectionData.element.offsetTop;
    const sectionHeight = nextSectionData.element.offsetTop - sectionStart;
    
    if (sectionHeight <= 0) return 0;
    
    return Math.max(0, Math.min(1, (scrollYValue - sectionStart) / sectionHeight));
  }, [sections]);

  // Calculate indicator position and dimensions
  const calculateIndicatorStyle = useCallback((
    currentIndex: number,
    progress: number,
    containerHeight: number
  ) => {
    const currentLinkEl = linkRefs.current[currentIndex];
    const nextLinkEl = linkRefs.current[currentIndex + 1];
    
    if (!currentLinkEl) return null;

    const initialTop = currentLinkEl.offsetTop;
    const initialHeight = currentLinkEl.offsetHeight;

    let top = initialTop;
    let height = initialHeight;

    if (nextLinkEl && progress > 0) {
      const nextTop = nextLinkEl.offsetTop;
      const nextHeight = nextLinkEl.offsetHeight;
      top = initialTop + (nextTop - initialTop) * progress;
      height = initialHeight + (nextHeight - initialHeight) * progress;
    }

    const bottom = containerHeight - (top + height);

    return {
      bottom,
      height,
      activeSectionIndex: currentIndex
    };
  }, []);

  // Update indicator based on scroll position
  const updateIndicator = useCallback((scrollYValue: number, animate: boolean = false) => {
    if (!navRef.current || cachedSectionsRef.current.size === 0) return;

    const containerHeight = navRef.current.offsetHeight;
    const currentSectionIndex = getCurrentSectionIndex(scrollYValue);
    const progress = calculateScrollProgress(currentSectionIndex, scrollYValue);
    const newIndicatorStyle = calculateIndicatorStyle(
      currentSectionIndex, 
      progress, 
      containerHeight
    );

    if (newIndicatorStyle) {
      setIndicatorState(newIndicatorStyle);
      
      if (animate) {
        // Animate to new position when sections change
        indicatorControls.start({
          bottom: newIndicatorStyle.bottom,
          height: newIndicatorStyle.height,
          transition: {
            type: "spring",
            stiffness: 280,
            damping: 25,
            mass: 1,
            duration: 0.8
          }
        }).then(() => {
          // Sync motion values after animation completes
          indicatorBottom.set(newIndicatorStyle.bottom);
          indicatorHeight.set(newIndicatorStyle.height);
        });
      } else {
        // Update motion values directly for scroll tracking
        indicatorBottom.set(newIndicatorStyle.bottom);
        indicatorHeight.set(newIndicatorStyle.height);
      }
    }
  }, [getCurrentSectionIndex, calculateScrollProgress, calculateIndicatorStyle, indicatorBottom, indicatorHeight, indicatorControls]);

  // Subscribe to scroll changes using Framer Motion
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      updateIndicator(latest, false); // Don't animate during scroll
    });

    return unsubscribe;
  }, [scrollY, updateIndicator]);

  // Wait for DOM elements to be available
  const waitForDOMElements = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const checkElements = () => {
        // Check if all section elements exist in DOM
        const allElementsExist = sections.every(section => 
          document.getElementById(section.id) !== null
        );
        
        if (allElementsExist) {
          resolve(true);
        } else {
          // Use requestAnimationFrame to check again on next frame
          requestAnimationFrame(checkElements);
        }
      };
      
      checkElements();
    });
  }, [sections]);

  // Handle sections change with animation
  useEffect(() => {
    if (sections.length === 0) return;
    
    // Check if sections actually changed
    const sectionsChanged = JSON.stringify(prevSectionsRef.current) !== JSON.stringify(sections);
    
    const handleSectionUpdate = async () => {
      if (sectionsChanged) {
        // Wait for DOM elements to be ready
        await waitForDOMElements();
        updateSectionCache();
        
        // Use requestAnimationFrame to ensure smooth animation timing
        requestAnimationFrame(() => {
          updateIndicator(scrollY.get(), true); // Always animate when sections change
          prevSectionsRef.current = [...sections]; // Update the reference
        });
      } else {
        // Normal update without section change
        updateSectionCache();
        updateIndicator(scrollY.get(), false);
      }
    };

    handleSectionUpdate();
  }, [sections, updateSectionCache, updateIndicator, scrollY, waitForDOMElements]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href) return;
    
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  // Transform scroll progress to smooth animation values
  const smoothBottom = useTransform(indicatorBottom, (value) => value);
  const smoothHeight = useTransform(indicatorHeight, (value) => value);

  // Don't render if loading or no sections
  if (isLoading || !sections || sections.length === 0) {
    return null;
  }

  return (
    <nav
      ref={navRef}
      className="fixed bottom-6 left-8 z-[70] flex flex-col items-start mix-blend-difference"
      role="navigation"
      aria-label="Page sections"
    >
      {/* Framer Motion animated indicator bar */}
      <motion.div
        className="absolute left-[-.7rem] w-[01px] bg-[#FFFFFF]"
        style={{
          bottom: smoothBottom,
          height: smoothHeight,
        }}
        animate={indicatorControls}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
          mass: 0.8,
        }}
        aria-hidden="true"
      />
      
      {sections.map((section, index) => (
        <motion.a
          href={`#${section.id}`}
          key={section.id}
          ref={(el) => {
            linkRefs.current[index] = el;
          }}
          onClick={handleLinkClick}
          className={`font-light text-sm leading-relaxed transition-colors duration-300 ${
            indicatorState.activeSectionIndex === index 
              ? "text-white" 
              : "text-[#838383]"
          }`}
          aria-current={indicatorState.activeSectionIndex === index ? "true" : undefined}
          // Add subtle hover animation
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          // Add tap animation
          whileTap={{ scale: 0.95 }}
          // Animate links when sections change
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05, // Stagger animation
            ease: "easeOut"
          }}
        >
          {section.name}
        </motion.a>
      ))}
    </nav>
  );
};

export default SectionLinksFramerMotion;
