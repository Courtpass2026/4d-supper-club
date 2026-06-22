"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Weekly Status Capsule — the signature, always-current element at the top of
 * the home screen. Like a live scoreboard, it reflects exactly where we are in
 * the weekly supper-club ritual based on the member's local day of week.
 *
 * The day is resolved client-side (the page is statically prerendered, so a
 * server-computed day would be frozen at build time). To avoid a hydration
 * mismatch we render a stable default until mounted, then swap to the real day.
 */

type Phase = {
  /** Short ritual phase label shown above the headline. */
  eyebrow: string;
  /** The big, confident statement. */
  headline: string;
  /** One whisper-quiet supporting line. */
  sub: string;
  /** CTA label + destination tuned to the moment. */
  ctaLabel: string;
  ctaHref: string;
  /** Wednesday gets urgency styling; everything else stays calm. */
  urgent?: boolean;
};

const PHASES: Record<number, Phase> = {
  // Sunday
  0: {
    eyebrow: "Sunday · Delivery Day",
    headline: "Your Meals Are On The Way",
    sub: "Chef Rich's kitchen is out for delivery across Riverview today. Keep an eye on your door.",
    ctaLabel: "View This Week's Menu",
    ctaHref: "/menu",
  },
  // Monday
  1: {
    eyebrow: "Monday · Menu Released",
    headline: "New Menu Just Dropped",
    sub: "Seven scratch-made dishes, freshly curated for the week ahead. First look starts now.",
    ctaLabel: "See What's New",
    ctaHref: "/menu",
  },
  // Tuesday
  2: {
    eyebrow: "Tuesday · Member Favorites",
    headline: "This Week's Most Popular Meals Are Trending",
    sub: "See what fellow members are reserving most before selections fill up.",
    ctaLabel: "Browse the Menu",
    ctaHref: "/menu",
  },
  // Wednesday
  3: {
    eyebrow: "Wednesday · Last Call",
    headline: "Selections Close Tonight",
    sub: "Reserve your meals before midnight to join this week's delivery.",
    ctaLabel: "Reserve Before It Closes",
    ctaHref: "/order",
    urgent: true,
  },
  // Thursday
  4: {
    eyebrow: "Thursday · In the Kitchen",
    headline: "Chef Preparation Begins",
    sub: "Reserved selections are locked in. Chef Rich is sourcing and prepping every dish from scratch.",
    ctaLabel: "View Your Menu",
    ctaHref: "/menu",
  },
  // Friday
  5: {
    eyebrow: "Friday · Packaging & Logistics",
    headline: "Packaging & Logistics Underway",
    sub: "Each meal is portioned, packed, and routed for a fresh weekend arrival.",
    ctaLabel: "View This Week's Menu",
    ctaHref: "/menu",
  },
  // Saturday
  6: {
    eyebrow: "Saturday · Almost There",
    headline: "Delivery Arrives Tomorrow",
    sub: "Everything's ready. Your chef-crafted week is on the schedule for Sunday.",
    ctaLabel: "Preview the Menu",
    ctaHref: "/menu",
  },
};

/** Stable default for SSR / first paint (matches Monday's release energy). */
const DEFAULT_PHASE: Phase = PHASES[1];

const RITUAL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/** Map JS getDay() (0=Sun) to the Mon-first ritual index. */
const RITUAL_INDEX: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  0: 6,
};

export default function WeeklyStatus() {
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => {
    setDay(new Date().getDay());
  }, []);

  const phase = day === null ? DEFAULT_PHASE : (PHASES[day] ?? DEFAULT_PHASE);
  const activeRitual = day === null ? 0 : (RITUAL_INDEX[day] ?? 0);

  return (
    <section
      aria-label="This week's supper club status"
      className="border-b border-gray-100 bg-gradient-to-b from-white to-gray-50 px-6 pt-14 pb-16 text-center sm:pt-16 sm:pb-20"
    >
      <div className="mx-auto max-w-[860px]">
        {/* Live indicator + ritual phase */}
        <div
          className={`mb-6 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em] transition-colors ${
            phase.urgent
              ? "border-gold-200 bg-gold-50 text-gold-700"
              : "border-gray-200 bg-white text-gray-600"
          }`}
        >
          <span
            className={`status-dot inline-block h-2 w-2 shrink-0 rounded-full ${
              phase.urgent ? "bg-gold-500" : "bg-green-500"
            }`}
            aria-hidden="true"
          />
          {phase.eyebrow}
        </div>

        {/* The statement */}
        <h2 className="mx-auto max-w-[760px] font-heading text-[clamp(2.1rem,6vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-gray-900">
          {phase.headline}
        </h2>

        <p className="mx-auto mt-5 max-w-[520px] text-[clamp(0.95rem,2vw,1.075rem)] font-light leading-relaxed text-gray-500">
          {phase.sub}
        </p>

        {/* Single, confident next action */}
        <div className="mt-8">
          <Link
            href={phase.ctaHref}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition-all duration-200 hover:-translate-y-px hover:shadow-md ${
              phase.urgent
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-green-500 text-gray-900 hover:bg-green-600"
            }`}
          >
            {phase.ctaLabel}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Weekly ritual timeline — quietly orients the member in the cycle. */}
        <ol
          className="mx-auto mt-12 flex max-w-[460px] items-center justify-between"
          aria-hidden="true"
        >
          {RITUAL.map((label, i) => {
            const isActive = i === activeRitual;
            const isPast = i < activeRitual;
            return (
              <li
                key={label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    isActive
                      ? "h-2 w-2 bg-gray-900 ring-4 ring-gray-900/10"
                      : isPast
                        ? "bg-gray-400"
                        : "bg-gray-200"
                  }`}
                />
                <span
                  className={`text-[0.62rem] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isActive ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
