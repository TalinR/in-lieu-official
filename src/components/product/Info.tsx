"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/shopify/types";
import { getLocalProductContent } from "@/content/productContent";
import { RichText } from "@/lib/shopify/richtext";
import FindYourSize from "@/components/product/FindYourSize/FindYourSize";


type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function Info({ product }: { product: Product }) {
  const local = getLocalProductContent(product.handle);
  console.log(product.handle);

  const sections: Section[] = useMemo(() => [
    {
        id: "description",
        title: "description",
        content: product.longDescription?.value ? (
            <RichText value={product.longDescription.value} />
        ) : (
          <p className="text-sm text-neutral-600">—</p>
        )
      },
    {
      id: "find-your-size",
      title: "find your size",
      content: local?.sizeGuide ? (
        <FindYourSize guide={local.sizeGuide} />
      ) : (
        <p className="text-sm text-neutral-600">—</p>
      )
    },
    {
      id: "composition",
      title: "composition",
      content: local?.composition ? (
        <div className="grid grid-cols-4 gap-10 text-center px-4">
          {local.composition.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <Image
                src={item.icon}
                alt={item.alt}
                width={55}
                height={55}
                priority={false}
                className="pb-2 w-12 lg:w-12"
              />
              <div className="text-md">{item.percent}%</div>
              <div className="text-xs text-neutral-700">{item.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-600">—</p>
      )
    },
    {
      id: "care-instructions",
      title: "care instructions",
      content: <p>Care instructions placeholder.</p>
    },
    {
      id: "delivery-and-returns",
      title: "delivery and returns",
      content: <p>Delivery & returns placeholder.</p>
    }
  ], [product.longDescription?.value, local?.sizeGuide, local?.composition]);

  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [instantOpenSections, setInstantOpenSections] = useState<Set<string>>(new Set());
  
  // Refs for cleanup
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventTimeRef = useRef<number>(0);

  // Memoized valid section IDs
  const validSectionIds = useCallback(() => new Set(sections.map(s => s.id)), [sections]);

  // Clean up instant-open flags after animation completes
  useEffect(() => {
    if (instantOpenSections.size > 0) {
      const cleanupTimer = setTimeout(() => {
        setInstantOpenSections(new Set());
      }, 100);
      return () => clearTimeout(cleanupTimer);
    }
  }, [openSections, instantOpenSections.size]);

  const handleOpenSection = useCallback((event: CustomEvent<{ sectionId: string }>) => {
    try {
      const { sectionId } = event.detail;
      const now = Date.now();
      
      // Debounce rapid events (prevent multiple calls within 100ms)
      if (now - lastEventTimeRef.current < 100) {
        return;
      }
      lastEventTimeRef.current = now;

      // Validate section exists
      if (!validSectionIds().has(sectionId)) {
        console.warn(`[Info] Attempted to open non-existent section: ${sectionId}`);
        return;
      }

      // Clear any pending scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }

      // Mark as instant open
      setInstantOpenSections((prev) => new Set(prev).add(sectionId));

      // Open the section
      setOpenSections((prev) => new Set(prev).add(sectionId));

      // Schedule scroll with cleanup tracking
      scrollTimeoutRef.current = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          console.warn(`[Info] Could not find element with ID: ${sectionId}`);
        }
        scrollTimeoutRef.current = null;
      }, 50);
    } catch (error) {
      console.error('[Info] Error handling openSection event:', error);
    }
  }, [validSectionIds]);

  useEffect(() => {
    window.addEventListener('openSection', handleOpenSection as EventListener);
    
    return () => {
      window.removeEventListener('openSection', handleOpenSection as EventListener);
      // Cleanup pending timeout on unmount
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [handleOpenSection]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <ul className="divide-y divide-neutral-200">
        {sections.map((s) => (
          <li key={s.id} id={s.id}>
            <motion.button
              className="flex w-full items-center justify-between py-4 text-left text-base font-light text-md"
              aria-expanded={openSections.has(s.id)}
              aria-controls={`${s.id}-panel`}
              // whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              transition={{ duration: 0.1 }}
              onClick={() => {
                // Clear instant-open flag for manual clicks
                setInstantOpenSections((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(s.id);
                  return newSet;
                });
                
                // Toggle section state
                setOpenSections((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(s.id)) {
                    newSet.delete(s.id);
                  } else {
                    newSet.add(s.id);
                  }
                  return newSet;
                });
              }}
            >
              <span className="">{s.title}</span>
              <motion.span 
                className="text-xl"
                animate={{ rotate: openSections.has(s.id) ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                +
              </motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
              {openSections.has(s.id) && (
                <motion.div
                  key={`${s.id}-panel`}
                  id={`${s.id}-panel`}
                  initial={instantOpenSections.has(s.id) ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ 
                    height: "auto", 
                    opacity: 1,
                    transition: instantOpenSections.has(s.id) ? { duration: 0 } : {
                      height: { duration: 0.3, ease: "easeOut" },
                      opacity: { duration: 0.2, delay: 0.1, ease: "easeOut" }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    transition: {
                      height: { duration: 0.3, ease: "easeIn" },
                      opacity: { duration: 0.1, ease: "easeIn" }
                    }
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-sm font-light text-neutral-700">
                    {s.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </section>
  );
}


