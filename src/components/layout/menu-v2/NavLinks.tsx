// src/components/layout/menu-v2/NavLinks.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

type LinkItem = { label: string; href: string };
type Group = { heading?: string; links: LinkItem[] };

type Props = {
  groups: Group[];
  onNavigate?: () => void;
  variant?: 'mobile' | 'desktop';
};

export default function NavLinks({ groups, onNavigate, variant = 'mobile' }: Props) {
  const pathname = usePathname();
  const size = variant === 'desktop' ? 'text-3xl' : 'text-2xl';
  const gapY = variant === 'desktop' ? 'space-y-2' : 'space-y-1';

  return (
    <div className="flex flex-col space-y-8">
      {groups.map((g, i) => (
        <div key={i} className="flex flex-col">
          {g.heading && (
            <span className="mb-2 text-xs font-light tracking-wide text-neutral-600">
              {g.heading}
            </span>
          )}
          <ul className={clsx('flex flex-col', gapY)}>
            {g.links.map((l) => {
              const isActive =
                pathname === l.href || pathname.startsWith(l.href + '/');
              return (
                <li key={l.href}>
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
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}