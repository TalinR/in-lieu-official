'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function EnterCodePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState<boolean | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  useEffect(() => {
    // Initialize user flags once per session; middleware controls page access.
    (async () => {
      const res = await fetch('/api/init-user', { method: 'POST', credentials: 'same-origin' });
      if (res.ok) {
        type InitUserResponse = { ok?: boolean; approved?: boolean; emailOptIn?: boolean };
        const data: InitUserResponse = await res.json().catch(() => ({} as InitUserResponse));
        if (typeof data.emailOptIn === 'boolean') setEmailOptIn(data.emailOptIn);
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const code = (new FormData(form).get('code') as string)?.trim();

    const res = await fetch('/api/redeem-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const { message } = await res.json().catch(() => ({ message: 'Invalid code' }));
      setError(message || 'Invalid code');
      setLoading(false);
      return;
    }

    // No need to refresh claims; middleware now reads persistent metadata
    router.push(next);
  }

  const { signOut } = useClerk();

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none">
      {/* Mobile: Single Background Image */}
      <div className="absolute right-0 bottom-0 h-3/4 w-3/4 lg:hidden">
        <Image
          src="/images/test_image_2.png"
          alt="In Lieu — mobile background"
          fill
          className="object-contain"
        />
      </div>

      {/* Desktop: 3-Column Layout with Images */}
      <div className="absolute inset-0 hidden lg:flex">
        {/* Left Image */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-full h-3/4">
            <Image
              src="/images/test_image_2.png"
              alt="In Lieu — left background"
              fill
              className="object-contain"
            />
          </div>
        </div>
        
        {/* Middle Column - Content Area */}
        <div className="w-96"></div>
        
        {/* Right Image */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-full h-3/4">
            <Image
              src="/images/test_image_2.png"
              alt="In Lieu — right background"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xl z-65" />
      
      {/* Content */}
      <div className="relative z-70 h-full flex overflow-hidden">
        {/* Mobile: top-left, Desktop: center */}
        <div className="w-full max-w-md p-8 lg:mx-auto lg:p-0 lg:flex lg:items-center lg:justify-center lg:h-full">
          <div className="lg:text-center">
            <h1 className="text-l font-light mb-2">Welcome, {user?.firstName}</h1>
            <p className="text-l font-light mb-5">Please enter your presale code</p>

            <form onSubmit={onSubmit} className="space-y-3">
              <div className="relative w-2xs">
                <input
                  name="code"
                  placeholder="Early access code"
                  required
                  autoFocus
                  className="w-full px-4 py-3 pr-12 text-sm font-light border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-300 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '...' : <span className="-mt-0.5">→</span>}
                </button>
              </div>

              {loading && (
                <motion.p 
                  className="text-gray-600 text-sm font-normal pl-1 lg:pl-0"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  please wait
                </motion.p>
              )}
              {error && !loading && <p className="text-gray-600 text-sm font-normal pl-1 lg:pl-0">{error}</p>}
            </form>
          </div>
        </div>
      </div>
      
      {/* Preferences + Sign Out (mobile: bottom-left, desktop: centered) */}
      <div className="absolute bottom-6 left-6 z-75 flex flex-col items-start text-left lg:left-1/2 lg:-translate-x-1/2 lg:items-center lg:text-center">
        <p className="text-xs font-light pb-2 text-gray-700">Email notifications are {emailOptIn ? 'on' : 'off'}</p>
        <button
          disabled={emailOptIn === null}
          onClick={async () => {
            const nextValue = !emailOptIn;
            setEmailOptIn(nextValue);
            const res = await fetch('/api/email-opt-in', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'same-origin',
              body: JSON.stringify({ value: nextValue }),
            });
            if (!res.ok) {
              // revert on failure
              setEmailOptIn(!nextValue);
              alert('Failed to update preference');
            }
          }}
          className="w-[100px] py-2 lg:py-1 text-sm lg:text-xs font-light border border-gray-300 rounded-lg text-center mb-4 lg:mb-2 text-gray-700"
        >
          {emailOptIn ? 'Opt out' : 'Opt in'}
        </button>
        <p className="text-xs font-light pb-2 text-gray-700">Click to sign out</p>
        <button
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className="w-[100px] py-2 lg:py-1 text-sm lg:text-xs font-light border border-gray-300 rounded-lg text-center text-gray-700 lg:mb-20"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
