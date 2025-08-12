"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
 * progress through the sections. Now uses context to get sections dynamically.
 * @returns {React.ReactElement | null} The rendered navigation element or null if no sections.
 */
const SectionLinks = () => {
  const { sections, isLoading } = useSections();
  const [indicatorState, setIndicatorState] = useState<IndicatorState>({
    bottom: 0,
    height: 0,
    activeSectionIndex: 0,
  });
  
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const cachedSectionsRef = useRef<Map<string, CachedSectionData>>(new Map());
  const rafIdRef = useRef<number | null>(null);

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
  const getCurrentSectionIndex = useCallback((scrollY: number): number => {
    // Loop through the sections array in reverse order
    // to find the section that is currently in view
    // (if the section is currently in view, the sectionEl.offsetTop will be less than or equal to the scrollY,
    // since we're iterating in reverse order, the first section that satisfies this condition is the one currently in view)
    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionData = cachedSectionsRef.current.get(sections[i].id);
      if (sectionData && sectionData.element.offsetTop <= scrollY + 1) {
        return i;
      }
    }
    // If no section is in view, set the currentSectionIndex to 0
    return 0;
  }, [sections]);

  // Calculate scroll progress within current section
  const calculateScrollProgress = useCallback((
    currentIndex: number, 
    scrollY: number
  ): number => {
    // If we're already in the last section, return 0 progress
    if (currentIndex >= sections.length - 1) return 0;

    const currentSectionData = cachedSectionsRef.current.get(sections[currentIndex].id);
    const nextSectionData = cachedSectionsRef.current.get(sections[currentIndex + 1].id);
    
    if (!currentSectionData || !nextSectionData) return 0;

    // Now we'll calculate the progress of the scroll,
    // this will be a value between 0 and 1,
    // 0 being the top of the current section,
    // 1 being the top of the next section
    const sectionStart = currentSectionData.element.offsetTop;
    const sectionHeight = nextSectionData.element.offsetTop - sectionStart;
    
    if (sectionHeight <= 0) return 0;
    
    return Math.max(0, Math.min(1, (scrollY - sectionStart) / sectionHeight));
  }, [sections]);

  // Calculate indicator position and dimensions
  const calculateIndicatorStyle = useCallback((
    currentIndex: number,
    progress: number,
    containerHeight: number
  ) => {
    // Get the current link element
    const currentLinkEl = linkRefs.current[currentIndex];
    // Get the next link element, which will be null if we're already in the last section
    const nextLinkEl = linkRefs.current[currentIndex + 1];
    
    if (!currentLinkEl) return null;

    // Get the initial top and height of the current link element
    const initialTop = currentLinkEl.offsetTop;
    const initialHeight = currentLinkEl.offsetHeight;

    // Linearly interpolate the top and height of the indicator based on
    // the scroll progress within the current section. This creates the smooth
    // continuous movement effect.
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

  // Main scroll handler - now much more performant
  // We'll essentially find the current section in view, and how far down we are within that section
  // We'll take that, and map it between 0 and 1 (as progress)
  // We'll then map that to the progress of the indicator itself,
  // using the height of the "links" and the progress as a number between 0 and 1
  const handleScroll = useCallback(() => {
    if (!navRef.current || cachedSectionsRef.current.size === 0) return;

    const containerHeight = navRef.current.offsetHeight;
    // Get the current vertical scroll position of the page in pixels
    const scrollY = window.scrollY;

    const currentSectionIndex = getCurrentSectionIndex(scrollY);
    const progress = calculateScrollProgress(currentSectionIndex, scrollY);
    const newIndicatorStyle = calculateIndicatorStyle(
      currentSectionIndex, 
      progress, 
      containerHeight
    );

    if (newIndicatorStyle) {
      // Batch state updates to prevent unnecessary re-renders
      setIndicatorState(newIndicatorStyle);
    }
  }, [getCurrentSectionIndex, calculateScrollProgress, calculateIndicatorStyle]);

  // Throttled scroll handler using RAF
  const throttledScrollHandler = useCallback(() => {
    if (rafIdRef.current !== null) return;
    
    rafIdRef.current = window.requestAnimationFrame(() => {
      handleScroll();
      rafIdRef.current = null;
    });
  }, [handleScroll]);

  // Update cache and initial calculation when sections change
  useEffect(() => {
    if (sections.length === 0) return;
    
    // Small delay to ensure DOM elements are ready
    const timeoutId = setTimeout(() => {
      updateSectionCache();
      handleScroll();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [sections, updateSectionCache, handleScroll]);

  // Set up scroll listeners
  useEffect(() => {
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    window.addEventListener("resize", throttledScrollHandler);

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      window.removeEventListener("resize", throttledScrollHandler);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [throttledScrollHandler]);

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
      <div
        className="absolute left-[-.7rem] w-[1px] bg-[#FFFFFF] transition-all duration-500 ease-out"
        style={{
          bottom: indicatorState.bottom,
          height: indicatorState.height,
        }}
        aria-hidden="true"
      />
      {sections.map((section, index) => (
        <a
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
        >
          {section.name}
        </a>
      ))}
    </nav>
  );
};

export default SectionLinks;
