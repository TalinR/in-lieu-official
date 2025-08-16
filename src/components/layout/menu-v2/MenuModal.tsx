// src/components/layout/menu-v2/MenuModal.tsx
//test
'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import NavLinks from './NavLinks';
import ImagePane from './ImagePane';

// ... existing animation variants ...
const mobileSlideUp: Variants = {
  hidden: { x: '100%' },
  show: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
    } 
  },
  exit: { 
    x: '100%', 
    transition: { 
      duration: 0.3, 
      ease: [0.55, 0.06, 0.68, 0.19] as [number, number, number, number]
    } 
  }
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      delay: .4
    } 
  }
};

type MenuModalProps = {
  isOpen: boolean;
  onLinkClick?: () => void;
};

type ViewType = 'main' | 'account' | 'newsletter';

export default function MenuModal({ isOpen, onLinkClick }: MenuModalProps) {
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [emailOptIn, setEmailOptIn] = useState<boolean | null>(null);
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('This will permanently delete your account. This action cannot be undone. Continue?');
    if (!confirmed) return;
    try {
      const res = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        // Explicitly same-origin; prevents cookies from being sent to other origins
        credentials: 'same-origin'
      });
      if (!res.ok) throw new Error('Request failed');
      await signOut({ redirectUrl: '/sign-in' });
    } catch {
      alert('Failed to delete account. Please try again.');
    }
  };

  // Initialize email opt-in status
  useEffect(() => {
    if (isOpen && emailOptIn === null) {
      (async () => {
        const res = await fetch('/api/init-user', { method: 'POST', credentials: 'same-origin' });
        if (res.ok) {
          type InitUserResponse = { ok?: boolean; approved?: boolean; emailOptIn?: boolean };
          const data: InitUserResponse = await res.json().catch(() => ({} as InitUserResponse));
          if (typeof data.emailOptIn === 'boolean') setEmailOptIn(data.emailOptIn);
        }
      })();
    }
  }, [isOpen, emailOptIn]);

  // Main menu groups
  const SHOP_LINKS = [
    { label: 'avril', href: '/products/avril' },
    { label: 'lyon', href: '/products/lyon' }
  ];

  const EXPLORE_LINKS = [
    { label: 'home', href: '/' },
    { label: 'lookbook', href: '/lookbook' },
    { 
      label: 'account', 
      onClick: () => setCurrentView('account'),
      type: 'action' as const
    }
  ];

  const MAIN_GROUPS = [
    { heading: 'shop', links: SHOP_LINKS },
    { heading: 'explore', links: EXPLORE_LINKS }
  ];

  // Account view groups (without bottom actions)
  const ACCOUNT_GROUPS = [
    { 
      heading: 'account', 
      links: [
        { 
          label: 'newsletter', 
          onClick: () => setCurrentView('newsletter'),
          type: 'action' as const
        }
      ]
    },
    { 
      heading: 'coming soon', 
      links: [
        { label: 'wardrobe', type: 'text' as const },
        { label: 'avatar', type: 'text' as const },
        { label: 'try-on', type: 'text' as const },
        { label: 'perks', type: 'text' as const }
      ]
    }
  ];

  // Newsletter view groups 
  const NEWSLETTER_GROUPS = [
    { 
      heading: 'account', 
      links: [
        { 
          label: 'newsletter', 
          type: 'action' as const,
          onClick: () => {} // Empty function to maintain action styling without functionality
        }
      ]
    }
  ];

  // Bottom actions for account view
  const BOTTOM_ACTIONS = [
    { label: 'delete account', onClick: handleDeleteAccount, type: 'action' as const },
    { label: 'sign out', onClick: () => signOut({ redirectUrl: '/sign-in' }), type: 'action' as const }
  ];

  const currentGroups = currentView === 'account' ? ACCOUNT_GROUPS : currentView === 'newsletter' ? NEWSLETTER_GROUPS : MAIN_GROUPS;

  // Reset view when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setCurrentView('main');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Mobile / tablet: split – left auto-width links, right image */}
          <motion.div 
            className="flex h-[100dvh] w-screen bg-white lg:hidden"
            variants={mobileSlideUp}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.div 
              className="flex-none px-6 py-8 flex flex-col justify-between h-full"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <div>
                {(currentView === 'account' || currentView === 'newsletter') && (
                  <motion.button
                    onClick={() => setCurrentView(currentView === 'newsletter' ? 'account' : 'main')}
                    className="mb-4 text-sm text-neutral-400 hover:text-neutral-600 font-light"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
                    }}
                  >
                    ← back
                  </motion.button>
                )}
                {(currentView === 'account' || currentView === 'newsletter') && (
                  <motion.div
                    className="mb-6 text-2xl font-light text-neutral-600 leading-none"
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 } }
                    }}
                  >
                    Hey, {user?.firstName}
                  </motion.div>
                )}
                <NavLinks groups={currentGroups} onNavigate={onLinkClick} variant="mobile" />
                
                {currentView === 'newsletter' && (
                  <motion.div 
                    className="mt-8 space-y-2"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }
                    }}
                  >
                    <motion.p 
                      className="text-sm font-light text-neutral-500"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.3 } }
                      }}
                    >
                      {emailOptIn ? "you'll receive updates" : "you won't receive updates"}
                    </motion.p>
                    <motion.div
                      className="text-left text-2xl font-light leading-none"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.4 } }
                      }}
                    >
                      {!emailOptIn ? (
                        <button
                          disabled={emailOptIn === null}
                          onClick={async () => {
                            setEmailOptIn(true);
                            const res = await fetch('/api/email-opt-in', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'same-origin',
                              body: JSON.stringify({ value: true }),
                            });
                            if (!res.ok) {
                              setEmailOptIn(false);
                              alert('Failed to update preference');
                            }
                          }}
                          className="text-[#C9C9C9] hover:text-neutral-400 transition-colors disabled:opacity-50"
                        >
                          opt-in
                        </button>
                      ) : (
                        <span className="text-neutral-500">opt-in</span>
                      )}
                      <span className="text-[#C9C9C9]">/</span>
                      {emailOptIn ? (
                        <button
                          disabled={emailOptIn === null}
                          onClick={async () => {
                            setEmailOptIn(false);
                            const res = await fetch('/api/email-opt-in', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'same-origin',
                              body: JSON.stringify({ value: false }),
                            });
                            if (!res.ok) {
                              setEmailOptIn(true);
                              alert('Failed to update preference');
                            }
                          }}
                          className="text-[#C9C9C9] hover:text-neutral-400 transition-colors disabled:opacity-50"
                        >
                          opt-out
                        </button>
                      ) : (
                        <span className="text-neutral-500">opt-out</span>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </div>
              
              {currentView === 'account' && (
                <motion.div 
                  className="flex flex-col space-y-2"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } }
                  }}
                >
                  {BOTTOM_ACTIONS.map((action, index) => (
                    <motion.button
                      key={action.label}
                      onClick={() => {
                        action.onClick?.();
                        onLinkClick?.();
                      }}
                      className="text-left text-xl font-light text-neutral-600 hover:text-neutral-800 leading-none transition-colors"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 * index } }
                      }}
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
            <motion.div 
              className="flex-1"
              variants={imageReveal}
              initial="hidden"
              animate="show"
            >
              <ImagePane
                src="/images/test_image_2.png"
                alt="In Lieu — mobile menu image"
              />
            </motion.div>
          </motion.div>

          {/* Desktop: full overlay + only nav links */}
          <motion.div 
            className="relative hidden h-screen w-screen lg:flex backdrop-blur-[20px]"
            onClick={onLinkClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(to left, rgba(255, 255, 255, 1) 0px, rgba(255, 255, 255, 0.3) 300px, rgba(255, 255, 255, 0.3) 100%)'
            }}
          >
            <div className="relative z-10 pt-25 pr-10 flex h-full w-full items-start justify-end">
              <motion.div 
                className="text-right h-full flex flex-col justify-between"
                onClick={(e) => e.stopPropagation()}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <div>
                  {(currentView === 'account' || currentView === 'newsletter') && (
                    <motion.button
                      onClick={() => setCurrentView(currentView === 'newsletter' ? 'account' : 'main')}
                      className="mb-4 text-sm text-neutral-400 hover:text-neutral-600 block ml-auto font-light"
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
                      }}
                    >
                      back →
                    </motion.button>
                  )}
                  {(currentView === 'account' || currentView === 'newsletter') && (
                    <motion.div
                      className="mb-6 text-2xl font-light text-neutral-600 leading-none text-right"
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 } }
                      }}
                    >
                      Hey, {user?.firstName}
                    </motion.div>
                  )}
                  <NavLinks groups={currentGroups} onNavigate={onLinkClick} variant="desktop" />
                  
                  {currentView === 'newsletter' && (
                    <motion.div 
                      className="mt-8 space-y-2 text-right"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }
                      }}
                    >
                      <motion.p 
                        className="text-sm font-light text-neutral-500"
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.3 } }
                        }}
                      >
                        {emailOptIn ? "you'll receive updates" : "you won't receive updates"}
                      </motion.p>
                      <motion.div
                        className="text-right text-2xl font-light leading-none"
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.4 } }
                        }}
                      >
                        {!emailOptIn ? (
                          <button
                            disabled={emailOptIn === null}
                            onClick={async () => {
                              setEmailOptIn(true);
                              const res = await fetch('/api/email-opt-in', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'same-origin',
                                body: JSON.stringify({ value: true }),
                              });
                              if (!res.ok) {
                                setEmailOptIn(false);
                                alert('Failed to update preference');
                              }
                            }}
                            className="text-[#C9C9C9] hover:text-neutral-400 transition-colors disabled:opacity-50"
                          >
                            opt-in
                          </button>
                        ) : (
                          <span className="text-neutral-500">opt-in</span>
                        )}
                        <span className="text-[#C9C9C9]">/</span>
                        {emailOptIn ? (
                          <button
                            disabled={emailOptIn === null}
                            onClick={async () => {
                              setEmailOptIn(false);
                              const res = await fetch('/api/email-opt-in', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'same-origin',
                                body: JSON.stringify({ value: false }),
                              });
                              if (!res.ok) {
                                setEmailOptIn(true);
                                alert('Failed to update preference');
                              }
                            }}
                            className="text-[#C9C9C9] hover:text-neutral-400 transition-colors disabled:opacity-50"
                          >
                            opt-out
                          </button>
                        ) : (
                          <span className="text-neutral-500">opt-out</span>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </div>
                
                {currentView === 'account' && (
                  <motion.div 
                    className="flex flex-col space-y-2 text-right pb-10"
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.3 } }
                    }}
                  >
                    {BOTTOM_ACTIONS.map((action, index) => (
                      <motion.button
                        key={action.label}
                        onClick={() => {
                          action.onClick?.();
                          onLinkClick?.();
                        }}
                        className="text-right text-xl font-light text-neutral-600 hover:text-neutral-800 leading-none transition-colors"
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 * index } }
                        }}
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}