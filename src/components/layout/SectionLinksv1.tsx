"use client";
// ... existing code ...
import React, { useState, useEffect, useRef } from 'react';

interface Section {
  id: string;
// ... existing code ...
  name: string;
}

interface SectionLinksProps {
  sections: Section[];
}

const SectionLinks = ({ sections }: SectionLinksProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;

      const scrollY = window.scrollY;
      let currentSectionIndex = -1;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i].id);
        if (sectionEl && sectionEl.offsetTop <= scrollY + 1) {
          currentSectionIndex = i;
          break;
        }
      }

      if (currentSectionIndex === -1) {
        currentSectionIndex = 0;
      }

      const currentLinkEl = linkRefs.current[currentSectionIndex];
      if (!currentLinkEl) return;

      const currentSectionEl = document.getElementById(
        sections[currentSectionIndex].id
      );
      if (!currentSectionEl) return;

      const nextSectionIndex = currentSectionIndex + 1;
      const nextSectionEl =
        nextSectionIndex < sections.length
          ? document.getElementById(sections[nextSectionIndex].id)
          : null;

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

      const nextLinkEl = linkRefs.current[nextSectionIndex];
      const initialTop = currentLinkEl.offsetTop;
      const initialHeight = currentLinkEl.offsetHeight;

      let top = initialTop;
      let height = initialHeight;

      if (nextLinkEl) {
        const nextTop = nextLinkEl.offsetTop;
        const nextHeight = nextLinkEl.offsetHeight;
        top = initialTop + (nextTop - initialTop) * progress;
        height = initialHeight + (nextHeight - initialHeight) * progress;
      }

      setIndicatorStyle({ top, height });
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
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  return (
    <div
      ref={navRef}
      className="fixed bottom-4 left-10 flex flex-col items-start"
    >
      <div
        className="absolute left-[-1rem] w-0.5 bg-black"
        style={{
          top: indicatorStyle.top,
          height: indicatorStyle.height,
          transition: 'height 0.1s ease-out',
        }}
      />
      {sections.map((section, index) => (
        <a
          href={`#${section.id}`}
          key={section.id}
          ref={(el) => (linkRefs.current[index] = el)}
          className="z-10 text-black"
        >
          {section.name}
        </a>
      ))}
    </div>
  );
};

export default SectionLinks;