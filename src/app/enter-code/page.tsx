'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function EnterCodePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

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

    // Force the session token to refresh so middleware sees updated claims immediately
    await user?.reload(); // refreshes claims
    router.push(next);
  }

  const { signOut } = useClerk();

  return (
    <div className="min-h-screen relative">
      {/* Mobile: Single Background Image */}
      <div className="absolute right-0 bottom-0 h-6/8 w-3/4 lg:hidden">
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
      <div className="relative z-70 min-h-screen flex">
        {/* Mobile: top-left, Desktop: center */}
        <div className="w-full max-w-md p-10 lg:mx-auto lg:p-0 lg:flex lg:items-center lg:justify-center lg:min-h-screen">
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
      
      {/* Sign Out Button */}
      <button
        onClick={() => signOut({ redirectUrl: '/sign-in' })}
        className="absolute bottom-4 left-4 lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 z-75 w-[150px] py-3 ml-5 lg: ml-0 lg:mb-10 text-sm font-light border border-gray-300 rounded-lg text-center"
      >
        Sign out
      </button>
    </div>
  );
}
