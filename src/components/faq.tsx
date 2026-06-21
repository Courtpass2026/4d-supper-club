"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How does the weekly subscription work?",
    a: "Choose a plan for 2 or 4 people, pick your delivery day, and we'll bring freshly prepared meals to your door each week. The menu rotates weekly so you'll always have something new. You can skip a week or cancel anytime — no contracts.",
  },
  {
    q: "What area do you deliver to?",
    a: "We currently deliver throughout Riverview and the surrounding areas in Hillsborough County. Delivery is free for all subscribers. If you're outside our zone, reach out — we're expanding and may be able to accommodate you.",
  },
  {
    q: "Can you accommodate allergies and dietary restrictions?",
    a: "Absolutely. We accommodate gluten-free, dairy-free, nut-free, vegetarian, and other dietary needs. Just let us know when you sign up and we'll make sure every meal works for your household. For severe allergies, we'll consult with you directly.",
  },
  {
    q: "How do I heat the meals?",
    a: "Every meal comes with simple heating instructions. Most take 10-15 minutes in the oven or a few minutes in the microwave. They're designed to taste just as good reheated — no complicated steps, no special equipment.",
  },
  {
    q: "How much does it cost?",
    a: "Plans start at $12-15 per serving depending on the number of people and meals per week. That's less than takeout for restaurant-quality food made from fresh, high-quality ingredients. Catering and special events are quoted based on guest count and menu.",
  },
  {
    q: "What if I need to skip a week?",
    a: "No problem at all. Just let us know by Wednesday for the following week's delivery and we'll pause your order. No fees, no questions. Life happens — we get it.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="mx-auto mb-14 max-w-[600px] text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-green-500">
            FAQ
          </div>
          <h2 className="font-heading text-[clamp(1.6rem,3.5vw,2.25rem)] font-extrabold leading-tight tracking-tight text-gray-900">
            Questions? We&apos;ve Got Answers
          </h2>
        </div>

        <div className="mx-auto flex max-w-[720px] flex-col gap-2">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={`overflow-hidden rounded-xl border bg-white transition-colors ${
                  isOpen ? "border-green-400" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-[18px] text-left text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  {item.q}
                  <svg
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-green-500" : "text-gray-400"
                    }`}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-[18px] text-[0.925rem] leading-relaxed text-gray-600">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
