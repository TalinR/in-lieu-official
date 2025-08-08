"use client";

import React, { useState } from "react";
import type { Product } from "@/lib/shopify/types";

type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function Info({ product }: { product: Product }) {
  const sections: Section[] = [
    {
      id: "description",
      title: "description",
      content: (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      )
    },
    {
      id: "find-your-size",
      title: "find your size",
      content: <p>Size guide content placeholder.</p>
    },
    {
      id: "care-instructions",
      title: "care instructions",
      content: <p>Care instructions placeholder.</p>
    },
    {
      id: "delivery-and-returns",
      title: "delivery and returns",
      content: <p>Delivery & returns placeholder.</p>
    }
  ];

  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <ul className="divide-y divide-neutral-200">
        {sections.map((s) => (
          <li key={s.id} id={s.id}>
            <button
              className="flex w-full items-center justify-between py-4 text-left text-base font-light text-md"
              aria-expanded={openId === s.id}
              aria-controls={`${s.id}-panel`}
              onClick={() => setOpenId((prev) => (prev === s.id ? null : s.id))}
            >
              <span className="">{s.title}</span>
              <span className="text-xl">{openId === s.id ? "−" : "+"}</span>
            </button>
            {openId === s.id && (
              <div id={`${s.id}-panel`} className="pb-6 text-sm font-light text-neutral-700">
                {s.content}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}


