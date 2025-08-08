import React from 'react';

type HeroProps = {
  copy: React.ReactNode;
  gallery: React.ReactNode;
  purchasePanel: React.ReactNode;
};

export default function Hero({ copy, gallery, purchasePanel }: HeroProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-5">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Mobile: gallery → copy → purchase. Desktop: copy → gallery → purchase. */}
        <div className="order-1 lg:order-2 lg:col-span-7">{gallery}</div>
        <div className="order-2 lg:order-1 lg:col-span-3">{copy}</div>
        <div className="order-3 lg:order-3 lg:col-span-2">{purchasePanel}</div>
      </div>
    </section>
  );
}


