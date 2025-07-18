"use client";
// ... existing code ...
import React, { useState, useEffect, useRef } from "react";
import { useSections } from "./SectionsContext";

/**
 * A fixed-position navigation component that displays links to page sections.
 * It features a vertical indicator bar that smoothly tracks the user's scroll
 * progress through the sections. Now uses context to get sections dynamically.
 * @returns {React.ReactElement | null} The rendered navigation element or null if no sections.
 */

const SectionLinks = () => {
  const { sections } = useSections();
  const [indicatorStyle, setIndicatorStyle] = useState({ bottom: 0, height: 0 });
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
  };

  useEffect(() => {

    // we'll essentially find the current section in view, and how far down we are within that section
    // we'll take that, and map it between 0 and 1 (as progress)
    // we'll then map that to the progress of the indicator itself, 
    // using the height of the "links" and the progress as a number between 0 and 1
    const handleScroll = () => {
      if (!navRef.current) return;
      const containerHeight = navRef.current.offsetHeight;

      // get the current vertical scroll position of the page in pixels
      const scrollY = window.scrollY;
      let currentSectionIndex = -1;

      // loop through the sections array in reverse order
      // to find the section that is currently in view 
      // (if the section is currently in view, the sectionEl.offsetTop will be less than or equal to the scrollY, 
      // since we're iterating in reverse order, the first section that satisfies this condition is the one currently in view)
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i].id);
        if (sectionEl && sectionEl.offsetTop <= scrollY + 1) {
          currentSectionIndex = i;
          break;
        }
      }

      // if no section is in view, set the currentSectionIndex to 0
      if (currentSectionIndex === -1) {
        currentSectionIndex = 0;
      }

      setActiveSectionIndex(currentSectionIndex);

      // get the current link element
      const currentLinkEl = linkRefs.current[currentSectionIndex];
      if (!currentLinkEl) return;

      // get the current section element
      const currentSectionEl = document.getElementById(
        sections[currentSectionIndex].id
      );
      if (!currentSectionEl) return;

      const nextSectionIndex = currentSectionIndex + 1;

      // now we'll check if we're already in the last section nextSectionIndex would be >= sections.length
      // if we are, we'll set the nextSectionEl to null
      // otherwise, we'll get the next section element
      const nextSectionEl =
        nextSectionIndex < sections.length
          ? document.getElementById(sections[nextSectionIndex].id)
          : null;

      // now we'll calculate the progress of the scroll,
      // this will be a value between 0 and 1,
      // 0 being the top of the current section,
      // 1 being the top of the next section
      let progress = 0;
      if (nextSectionEl) {
        const sectionStart = currentSectionEl.offsetTop;
        const sectionHeight = nextSectionEl.offsetTop - sectionStart;
        if (sectionHeight > 0) {
          progress = Math.max(
            0,
            Math.min(1, (scrollY - sectionStart) / sectionHeight)
          );
        }
      }

      // now we'll get the next link element, which will be null if we're already in the last section
      const nextLinkEl = linkRefs.current[nextSectionIndex];

      // now we'll get the initial top and height of the current link element
      const initialTop = currentLinkEl.offsetTop;
      const initialHeight = currentLinkEl.offsetHeight;


      // Linearly interpolate the top and height of the indicator based on
      // the scroll progress within the current section. This creates the smooth
      // continuous movement effect.
      let top = initialTop;
      let height = initialHeight;

      //
      if (nextLinkEl) {
        const nextTop = nextLinkEl.offsetTop;
        const nextHeight = nextLinkEl.offsetHeight;
        top = initialTop + (nextTop - initialTop) * progress;
        height = initialHeight + (nextHeight - initialHeight) * progress;
      }
      
      const bottom = containerHeight - (top + height);

      setIndicatorStyle({ bottom, height });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  // Remove early return for isLoading; keep only for no sections.
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div
      ref={navRef}
      className="fixed bottom-6 left-8 z-[70] flex flex-col items-start mix-blend-difference "
    >
      <div
        className="absolute left-[-.7rem] w-[01px] bg-[#FFFFFF] transition-all duration-600 ease-out"
        style={{
          bottom: indicatorStyle.bottom,
          height: indicatorStyle.height,
        }}
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
            activeSectionIndex === index ? "text-white" : "text-[#838383]"
          }`}
        >
          {section.name}
        </a>
      ))}
    </div>
  );
};

export default SectionLinks;
