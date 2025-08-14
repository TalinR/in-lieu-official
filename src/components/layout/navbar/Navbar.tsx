'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CartButton from './CartButton';
import MenuButton from './MenuButton';
import HomeButton from './HomeButton';
import MenuModal from '../menu-v2/MenuModal';
import CartModal from '@/components/cart/modal';
import Image from 'next/image';

const Navbar = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleCart = () => {
    if (!isCartOpen) {
      setMenuOpen(false); // Close menu when opening cart
    }
    setCartOpen(!isCartOpen);
  };
  const openCart = () => {
    setMenuOpen(false); // Close menu when opening cart
    setCartOpen(true);
  };
  const closeCart = () => setCartOpen(false);
  const toggleMenu = () => {
    if (!isMenuOpen) {
      setCartOpen(false); // Close cart when opening menu
    }
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
            <HomeButton />
            <CartButton onClick={toggleCart} />
            <MenuButton onClick={toggleMenu} />
          </div>
        </nav>
      </div>

      {/* Desktop: Top area with logo left, nav right */}
      <div className="hidden lg:block">
        <div className="fixed top-4 left-4 z-40">
          <Link href="/" className="block">
            <div className="flex flex-col items-center rounded-4xl bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2 transition-opacity hover:opacity-80 cursor-pointer">
            {/* <div className="flex flex-col items-center rounded-full px-7 py-3"> */}
              <div className="flex flex-col items-start">
                <Image src="/images/logo/black_logo.svg" alt="Logo" width={32} height={32} className="h-8 w-auto" />
                <span className="text-md font-light">Makkuro Early Access</span>
              </div>
            </div>
          </Link>
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