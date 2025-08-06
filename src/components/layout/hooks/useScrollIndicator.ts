import { useEffect, useRef, useCallback, useState, MutableRefObject } from "react";
import { MotionValue, useMotionValue } from "framer-motion";

interface Section {
  id: string;
  name: string;
}

interface CachedSectionData {
  element: HTMLElement;
  linkElement: HTMLAnchorElement;
}

interface UseScrollIndicatorProps {
  sections: Section[];
  scrollY: MotionValue<number>;
  navRef: MutableRefObject<HTMLDivElement | null>;
  linkRefs: MutableRefObject<(HTMLAnchorElement | null)[]>;
}

export const useScrollIndicator = ({ 
  sections, 
  scrollY, 
  navRef, 
  linkRefs 
}: UseScrollIndicatorProps) => {
  const cachedSectionsRef = useRef<Map<string, CachedSectionData>>(new Map());
  const prevSectionsRef = useRef<Section[]>([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Motion values for smooth indicator animation
  const indicatorBottom = useMotionValue(0);
  const indicatorHeight = useMotionValue(0);

  // Cache section elements
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
  }, [sections, linkRefs]);

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
  }, [linkRefs]);

  // Update indicator based on scroll position
  const updateIndicator = useCallback((scrollYValue: number) => {
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
      setActiveSectionIndex(newIndicatorStyle.activeSectionIndex);
      indicatorBottom.set(newIndicatorStyle.bottom);
      indicatorHeight.set(newIndicatorStyle.height);
    }
  }, [getCurrentSectionIndex, calculateScrollProgress, calculateIndicatorStyle, navRef, indicatorBottom, indicatorHeight]);

  // Wait for DOM elements to be available
  const waitForDOMElements = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      const checkElements = () => {
        const allElementsExist = sections.every(section => 
          document.getElementById(section.id) !== null
        );
        
        if (allElementsExist) {
          resolve();
        } else {
          requestAnimationFrame(checkElements);
        }
      };
      
      checkElements();
    });
  }, [sections]);

  // Subscribe to scroll changes
  useEffect(() => {
    const unsubscribe = scrollY.on('change', updateIndicator);
    return unsubscribe;
  }, [scrollY, updateIndicator]);

  // Handle sections change with animation
  useEffect(() => {
    if (sections.length === 0) return;
    
    // Check if sections actually changed using a more efficient comparison
    const sectionsChanged = prevSectionsRef.current.length !== sections.length ||
      prevSectionsRef.current.some((section, index) => section.id !== sections[index]?.id);
    
    const handleSectionUpdate = async () => {
      if (sectionsChanged) {
        await waitForDOMElements();
        updateSectionCache();
        
        requestAnimationFrame(() => {
          updateIndicator(scrollY.get());
          prevSectionsRef.current = [...sections];
        });
      } else {
        updateSectionCache();
        updateIndicator(scrollY.get());
      }
    };

    handleSectionUpdate();
  }, [sections, updateSectionCache, updateIndicator, scrollY, waitForDOMElements]);

  return {
    activeSectionIndex,
    indicatorBottom,
    indicatorHeight,
  };
}; 