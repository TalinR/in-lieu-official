'use client';

import { useState, useEffect } from 'react';
import CartButton from './CartButton';
import MenuButton from './MenuButton';
import MenuModal from '../menu-v2/MenuModal';
import CartModal from '@/components/cart/modal';

const Navbar = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleCart = () => setCartOpen(!isCartOpen);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* <SectionLinksFramerMotion /> */}

      {/* Mobile: Bottom-right pill (existing behavior) */}
      <div className="fixed bottom-4 right-4 z-60 lg:hidden">
      {/* <div className="fixed bottom-4 right-4 z-50 lg:left-1/2 lg:right-auto lg:-translate-x-1/2"> */}
        <nav className="navbar-bg-glass flex w-full items-center gap-x-3 rounded-full p-2 shadow-lg">
          <div className="flex items-center gap-x-2">
            <CartButton onClick={toggleCart} />
            <MenuButton onClick={toggleMenu} />
          </div>
        </nav>
      </div>

      {/* Desktop: Top area with logo left, nav right */}
      <div className="hidden lg:block">
        <div className="fixed top-4 left-4 z-40">
          <div className="flex flex-col items-center rounded-4xl bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2">
          {/* <div className="flex flex-col items-center rounded-full px-7 py-3"> */}
            <div className="flex flex-col items-start">
              <img src="/images/logo/black_logo.svg" alt="Logo" className="h-8 w-auto" />
              <span className="text-md font-light">August 2025</span>
            </div>
          </div>
        </div>
        
        <div className="fixed top-4 right-4 z-60">
          <nav className="flex w-full items-center gap-x-3 rounded-full p-2 bg-white/20 backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-x-2">
              <CartButton onClick={toggleCart} />
              <MenuButton onClick={toggleMenu} />
            </div>
          </nav>
        </div>
      </div>

      <CartModal isOpen={isCartOpen} onClose={closeCart} onOpen={openCart} />
      <MenuModal isOpen={isMenuOpen} onLinkClick={toggleMenu} />
    </>
  );
};

export default Navbar; 