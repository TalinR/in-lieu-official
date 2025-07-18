'use client';

import React, { useEffect } from 'react';
import { useSections } from '@/components/layout/SectionsContext';

const HomePage = () => {
  const { setSections } = useSections();

  useEffect(() => {
    // Set sections for the homepage when component mounts
    setSections([
      { id: 'makurro', name: 'makurro' },
      { id: 'lookbook', name: 'lookbook' },
      { id: 'about', name: 'about' },
      { id: 'shop', name: 'shop' },
    ]);

    // Cleanup: clear sections when component unmounts (optional)
    return () => {
      // Note: We might not want to clear on unmount if we want sections 
      // to persist during navigation. This will be refined in later steps.
    };
  }, [setSections]);

  return (
    <main className="flex min-h-screen flex-col">
      <section id="makurro" className="flex h-screen items-center justify-center bg-black">
        <h1 className="text-4xl font-bold">Makurro Section</h1>
      </section>
      <section id="lookbook" className="flex h-screen items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold">Lookbook Section</h1>
      </section>
      <section id="about" className="flex h-[10000px] items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold">About Section</h1>
      </section>
      <section id="shop" className="flex h-screen items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold">Shop Section</h1>
      </section>
    </main>
  );
};

export default HomePage;
