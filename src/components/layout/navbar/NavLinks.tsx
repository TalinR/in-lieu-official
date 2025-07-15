'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

type NavLink = {
  name: string;
  href: string; // e.g., '#shop'
};

const NavLinks = ({ links }: { links: NavLink[] }) => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState('');
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      links.forEach((link) => {
        const section = document.querySelector(link.href);
        if (section) {
          const sectionTop = section.getBoundingClientRect().top;
          // 150px offset to trigger the active state a bit sooner
          if (sectionTop <= 150) {
            current = link.href;
          }
        }
      });
      setActiveLink(current);
    };

    // Only set up scroll listener if we are on the main page
    if (pathname === '/') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      // On initial load, check if URL has a hash and scroll to it
      if (isInitialLoad.current && window.location.hash) {
          const element = document.querySelector(window.location.hash);
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
          }
      }
      isInitialLoad.current = false;
      
      // Initial check
      handleScroll();
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, links]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname === '/') {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
        // Update the URL hash without a hard page reload
        window.history.pushState(null, '', href);
        // Removed setActiveLink(href) - let scroll handler determine active state
      }
    }
    // If not on the homepage, the Next.js Link component will handle the navigation.
    // The browser will automatically scroll to the hash on the new page.
  };

  return (
    <div className="flex items-center gap-x-5">
      {links.map((link) => (
        <Link
          key={link.name}
          href={`/${link.href}`} // Navigates to example.com/#shop
          onClick={(e) => handleLinkClick(e, link.href)}
          className={clsx(
            'text-sm font-light text-black-600 transition-colors hover:text-black',
            {
              'underline decoration-1 underline-offset-4 decoration-black': activeLink === link.href,
            }
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks; 