// src/components/layout/menu-v2/NavLinks.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const linkVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    } 
  }
};

type LinkItem = { label: string; href: string };
type Group = { heading?: string; links: LinkItem[] };

type Props = {
  groups: Group[];
  onNavigate?: () => void;
  variant?: 'mobile' | 'desktop';
};

export default function NavLinks({ groups, onNavigate, variant = 'mobile' }: Props) {
  const pathname = usePathname();
  const size = variant === 'desktop' ? 'text-2xl' : 'text-2xl';
  const gapY = variant === 'desktop' ? 'space-y-2' : 'space-y-1';

  return (
    <div className="flex flex-col space-y-8">
      {groups.map((g, i) => (
        <motion.div key={i} className="flex flex-col" variants={linkVariants}>
          {g.heading && (
            <motion.span 
              className="mb-2 text-xs lg:text-sm font-light tracking-wide text-neutral-600"
              variants={linkVariants}
            >
              {g.heading}
            </motion.span>
          )}
          <ul className={clsx('flex flex-col', gapY)}>
            {g.links.map((l) => {
              const isActive =
                pathname === l.href || pathname.startsWith(l.href + '/');
              return (
                <motion.li key={l.href} variants={linkVariants}>
                  <Link
                    href={l.href}
                    onClick={onNavigate}
                    className={clsx(
                      'leading-none transition-colors font-light',
                      size,
                      isActive ? 'text-rose-500' : 'text-neutral-600 hover:text-neutral-600'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}