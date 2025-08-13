// src/components/layout/menu-v2/MenuModal.tsx
'use client';

import React from 'react';
import NavLinks from './NavLinks';
import ImagePane from './ImagePane';

type MenuModalProps = {
  isOpen: boolean;
  onLinkClick?: () => void;
};

const SHOP_LINKS = [
  { label: 'avril', href: '/products/avril' },
  { label: 'lyon', href: '/products/lyon' }
];

const EXPLORE_LINKS = [
  { label: 'home', href: '/' },
  { label: 'about', href: '/about' }
];

const GROUPS = [
  { heading: 'shop', links: SHOP_LINKS },
  { heading: 'explore', links: EXPLORE_LINKS }
];

export default function MenuModal({ isOpen, onLinkClick }: MenuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Mobile / tablet: split – left auto-width links, right image */}
      <div className="flex h-[100dvh] w-screen bg-white lg:hidden">
        <div className="flex-none px-6 py-8">
          <NavLinks groups={GROUPS} onNavigate={onLinkClick} variant="mobile" />
        </div>
        <div className="flex-1">
          <ImagePane
            src="/images/test_image_2.png"
            alt="In Lieu — mobile menu image"
          />
        </div>
      </div>

      {/* Desktop: full overlay + only nav links */}
      <div className="relative hidden h-screen w-screen lg:flex">
        {/* Color gradient + constant blur for now */}
                  <div className="absolute inset-0 backdrop-blur-[20px]" style={{
            background: 'linear-gradient(to left, rgba(255, 255, 255, 1) 0px, rgba(255, 255, 255, 0.3) 300px, rgba(255, 255, 255, 0.3) 100%)'
          }} />
        <div className="relative z-10 pt-25 pr-10 flex h-full w-full items-start justify-end">
          <div className="text-right">
            <NavLinks groups={GROUPS} onNavigate={onLinkClick} variant="desktop" />
          </div>
        </div>
      </div>
    </div>
  );
}