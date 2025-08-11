"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/shopify/types";
import { getLocalProductContent } from "@/content/productContent";
import { RichText } from "@/lib/shopify/richtext";
import FindYourSize from "@/components/product/FindYourSize/FindYourSize";


type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export default function Info({ product }: { product: Product }) {
  const local = getLocalProductContent(product.handle);
  console.log(product.handle);

  const sections: Section[] = [
    {
        id: "description",
        title: "description",
        content: product.longDescription?.value ? (
            <RichText value={product.longDescription.value} />
        ) : (
          <p className="text-sm text-neutral-600">—</p>
        )
      },
    {
      id: "find-your-size",
      title: "find your size",
      content: <FindYourSize guide={local?.sizeGuide} />
    },
    {
      id: "composition",
      title: "composition",
      content: local?.composition ? (
        <div className="grid grid-cols-4 gap-10 text-center px-4">
          {local.composition.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <Image
                src={item.icon}
                alt={item.alt}
                width={55}
                height={55}
                priority={false}
                className="pb-2"
              />
              <div className="text-md">{item.percent}%</div>
              <div className="text-xs text-neutral-700">{item.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-600">—</p>
      )
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


