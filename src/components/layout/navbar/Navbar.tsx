'use client';

import { useState, useEffect } from 'react';
import CartButton from './CartButton';
import MenuButton from './MenuButton';
import MenuModal from '../menu/MenuModal';
import SectionLinksFramerMotion from '../SectionLinksFramerMotion';
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
      <SectionLinksFramerMotion />

      <div className="fixed bottom-4 right-4 z-50">
        <nav className="navbar-bg-glass flex w-full items-center gap-x-3 rounded-full p-2 shadow-lg">
          <div className="flex items-center gap-x-2">
            <CartButton onClick={toggleCart} />
            <MenuButton onClick={toggleMenu} />
          </div>
        </nav>
      </div>

      <CartModal isOpen={isCartOpen} onClose={closeCart} onOpen={openCart} />
      <MenuModal isOpen={isMenuOpen} onLinkClick={toggleMenu} />
    </>
  );
};

export default Navbar; 