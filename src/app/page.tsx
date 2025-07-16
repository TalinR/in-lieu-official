import React from 'react';
import SectionLinks from '@/components/layout/SectionLinks';

const HomePage = () => {
  const sections = [
    { id: 'makurro', name: 'makurro' },
    { id: 'lookbook', name: 'lookbook' },
    { id: 'about', name: 'about' },
    { id: 'shop', name: 'shop' },
  ];

  return (
    <main className="flex min-h-screen flex-col">
      <SectionLinks sections={sections} />
      <section id="makurro" className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold">Makurro Section</h1>
      </section>
      <section id="lookbook" className="flex h-screen items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold">Lookbook Section</h1>
      </section>
      <section id="about" className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold">About Section</h1>
      </section>
      <section id="shop" className="flex h-screen items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold">Shop Section</h1>
      </section>
    </main>
  );
};

export default HomePage;
