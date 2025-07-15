'use client';

import { useState } from 'react';
import NavLinks from './NavLinks';
import CartButton from './CartButton';
import MenuButton from './MenuButton';

// Mock data for the navigation links
const navLinks = [
  { name: 'makurro', href: '#home' },
  { name: 'lookbook', href: '#lookbook' },
  { name: 'about', href: '#about' },
  { name: 'shop', href: '#shop' },
];

const Navbar = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleCart = () => setCartOpen(!isCartOpen);
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <>
      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
        <nav className="navbar-bg-glass flex w-full items-center gap-x-3 rounded-full p-2 shadow-lg">
          <div className="flex-1 pl-4 pr-1">
            <NavLinks links={navLinks} />
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-x-2">
            <CartButton onClick={toggleCart} />
            <MenuButton onClick={toggleMenu} />
          </div>
        </nav>
      </div>

      {/* Placeholder for Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleCart}>
          <div className="absolute right-0 top-0 h-full w-96 bg-white p-6">
            <h2 className="text-xl font-bold">Cart</h2>
            <p>Cart content goes here...</p>
          </div>
        </div>
      )}

      {/* Placeholder for Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleMenu}>
          <div className="absolute left-0 top-0 h-full w-96 bg-white p-6">
            <h2 className="text-xl font-bold">Menu</h2>
            <p>Menu content goes here...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 