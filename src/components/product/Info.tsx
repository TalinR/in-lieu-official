"use client";

import React, { useState, useEffect } from "react";
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

  const sections: Section[] = [
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
  ];

  const [sectionStates, setSectionStates] = useState<Map<string, { isOpen: boolean; shouldAnimate: boolean }>>(new Map());

  // Helper to check if section is open
  const isSectionOpen = (sectionId: string) => sectionStates.get(sectionId)?.isOpen ?? false;
  
  // Helper to check if section should animate
  const shouldSectionAnimate = (sectionId: string) => sectionStates.get(sectionId)?.shouldAnimate ?? true;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleOpenSection = (event: CustomEvent<{ sectionId: string }>) => {
      const sectionId = event.detail.sectionId;
      
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Open section without animation
      setSectionStates(prev => {
        const newMap = new Map(prev);
        newMap.set(sectionId, { isOpen: true, shouldAnimate: false });
        return newMap;
      });

      // Scroll to section after a brief delay to ensure DOM is updated
      timeoutId = setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
        timeoutId = null;
      }, 50);
    };

    window.addEventListener('openSection', handleOpenSection as EventListener);
    
    return () => {
      window.removeEventListener('openSection', handleOpenSection as EventListener);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <ul className="divide-y divide-neutral-200">
        {sections.map((s) => (
          <li key={s.id} id={s.id}>
            <motion.button
              className="flex w-full items-center justify-between py-4 text-left text-base font-light text-md"
              aria-expanded={isSectionOpen(s.id)}
              aria-controls={`${s.id}-panel`}
              whileTap={{ scale: 0.995 }}
              transition={{ duration: 0.1 }}
              onClick={() => {
                setSectionStates(prev => {
                  const newMap = new Map(prev);
                  const currentState = newMap.get(s.id);
                  const isCurrentlyOpen = currentState?.isOpen ?? false;
                  
                  // Toggle section with animation (manual clicks always animate)
                  newMap.set(s.id, { 
                    isOpen: !isCurrentlyOpen, 
                    shouldAnimate: true 
                  });
                  
                  return newMap;
                });
              }}
            >
              <span className="">{s.title}</span>
              <motion.span 
                className="text-xl"
                animate={{ rotate: isSectionOpen(s.id) ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                +
              </motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
              {isSectionOpen(s.id) && (
                <motion.div
                  key={`${s.id}-panel`}
                  id={`${s.id}-panel`}
                  initial={shouldSectionAnimate(s.id) ? { height: 0, opacity: 0 } : { height: "auto", opacity: 1 }}
                  animate={{ 
                    height: "auto", 
                    opacity: 1,
                    transition: shouldSectionAnimate(s.id) ? {
                      height: { duration: 0.3, ease: "easeOut" },
                      opacity: { duration: 0.2, delay: 0.1, ease: "easeOut" }
                    } : { duration: 0 }
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


