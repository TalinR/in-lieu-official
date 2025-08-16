'use client';

import { Product } from '@/lib/shopify/types';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function WishlistButton({ product }: { product: Product }) {
  const [isInWishlist, setIsInWishlist] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoaded } = useUser();

  // Load initial wishlist status
  useEffect(() => {
    if (isLoaded && user && isInWishlist === null) {
      (async () => {
        try {
          const res = await fetch('/api/wishlist', { 
            method: 'GET', 
            credentials: 'same-origin' 
          });
          if (res.ok) {
            const data = await res.json();
            const wishlist = data.wishlist || {};
            setIsInWishlist(!!wishlist[product.title]);
          }
        } catch (error) {
          console.error('Failed to load wishlist:', error);
          setIsInWishlist(false);
        }
      })();
    }
  }, [isLoaded, user, product.title, isInWishlist]);

  const handleToggleWishlist = async () => {
    if (!user || isLoading || isInWishlist === null) return;

    const newWishlistState = !isInWishlist;
    setIsLoading(true);
    
    // Optimistic update
    setIsInWishlist(newWishlistState);

    try {
      const res = await fetch('/api/wishlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ 
          productTitle: product.title, 
          inWishlist: newWishlistState 
        }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }
    } catch (error) {
      // Revert optimistic update on error
      console.error('Failed to update wishlist:', error);
      setIsInWishlist(!newWishlistState);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth or wishlist status
  if (!isLoaded || isInWishlist === null) {
    return (
      <button 
        disabled
        className="relative flex w-full items-center justify-center text-neutral-400 rounded-lg bg-white px-5 py-2 border-[0.5px] border-[#E5E5E5]"
      >
        <span className="lowercase font-light tracking-normal">loading...</span>
      </button>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <button 
        onClick={() => window.location.href = '/sign-in'}
        className="relative flex w-full items-center justify-center text-neutral-800 rounded-lg bg-white px-5 py-2 border-[0.5px] border-[#E5E5E5] hover:bg-neutral-50"
      >
        <span className="lowercase font-light tracking-normal">sign in to save</span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`relative flex w-full bg-white items-center justify-center rounded-lg px-5 py-2 border-[0.5px] transition-colors ${
        isLoading 
          ? 'text-neutral-400 border-[#E5E5E5] cursor-not-allowed'
          : isInWishlist
          ? 'text-neutral-400 border-neutral-300 hover:bg-neutral-50'
          : 'text-neutral-800 border-[#E5E5E5] hover:bg-bg-neutral-50'
      }`}
    >
      <span className="lowercase font-light tracking-normal">
        {isLoading 
          ? 'updating...' 
          : isInWishlist 
          ? 'remove from wishlist' 
          : 'add to wishlist'
        }
      </span>
    </button>
  );
}