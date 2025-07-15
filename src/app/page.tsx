import React from 'react';

const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col">
      <section id="home" className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold">Home Section</h1>
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
