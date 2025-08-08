import React from 'react';

type HeroProps = {
  copy: React.ReactNode;
  gallery: React.ReactNode;
  purchasePanel: React.ReactNode;
};

export default function Hero({ copy, gallery, purchasePanel }: HeroProps) {
  return (
    <section className="mx-auto max-w-[3000px] px-5 pt-5">
      <div className="grid grid-cols-1 gap-6 lg:flex lg:items-start">
        {/* Mobile: gallery → copy → purchase. Desktop: copy (fixed) → gallery (flex) → purchase (fixed). */}
        <div className="order-1 lg:order-2 lg:flex-2 lg:min-w-0">{gallery}</div>
        <div className="order-2 lg:order-1 lg:flex-1 lg:shrink-0">{copy}</div>
        <div className="order-3 lg:order-3 lg:flex-1 lg:shrink-0">{purchasePanel}</div>
      </div>
    </section>
  );
}


