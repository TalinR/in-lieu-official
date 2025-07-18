'use client';

import { useState, useEffect } from 'react';
import CartButton from './CartButton';
import MenuButton from './MenuButton';
import MenuModal from '../menu/MenuModal';


const Navbar = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleCart = () => setCartOpen(!isCartOpen);
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
      <div className="fixed bottom-4 right-4 z-50">
        <nav className="navbar-bg-glass flex w-full items-center gap-x-3 rounded-full p-2 shadow-lg">
          {/* <div className="flex-1 pl-4 pr-1">
            <NavLinks links={navLinks} />
          </div> */}

          {/* <div className="h-6 w-px bg-gray-300" /> */}

          <div className="flex items-center gap-x-2">
            <CartButton onClick={toggleCart} />
            <MenuButton onClick={toggleMenu} />
          </div>
        </nav>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleCart}>
          <div className="absolute right-0 top-0 h-full w-96 bg-white p-6">
            <h2 className="text-xl font-bold">Cart</h2>
            <p>Cart content goes here...</p>
          </div>
        </div>
      )}

      <MenuModal isOpen={isMenuOpen} onLinkClick={toggleMenu} />
    </>
  );
};

export default Navbar; 