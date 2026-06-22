"use client";

import { useEffect, useState } from "react";

/**
 * Weekly Status — the signature, always-current element of the home hero.
 * Like a live scoreboard, it reflects exactly where we are in the weekly
 * supper-club ritual based on the member's local day of week.
 *
 * In the full-bleed hero the food photo is the star, so this is intentionally
 * compact: a small status pill (`WeeklyStatus`) that floats over the image, and
 * a quiet 7-dot ritual timeline (`WeeklyTimeline`) that sits below it on the
 * light content band. Both resolve the day client-side — the page is statically
 * prerendered, so a server-computed day would be frozen at build time. To avoid
 * a hydration mismatch we render a stable default until mounted, then swap to
 * the real day.
 */

type Phase = {
  /** Short ritual phase label shown in the status pill. */
  eyebrow: string;
  /** Wednesday gets urgency styling; everything else stays calm. */
  urgent?: boolean;
};

const PHASES: Record<number, Phase> = {
  0: { eyebrow: "Sunday · Delivery Day" }, // Sunday
  1: { eyebrow: "Monday · Menu Released" }, // Monday
  2: { eyebrow: "Tuesday · Member Favorites" }, // Tuesday
  3: { eyebrow: "Wednesday · Last Call", urgent: true }, // Wednesday
  4: { eyebrow: "Thursday · In the Kitchen" }, // Thursday
  5: { eyebrow: "Friday · Packaging & Logistics" }, // Friday
  6: { eyebrow: "Saturday · Almost There" }, // Saturday
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

/** Resolve the member's local day of week after mount (null during SSR). */
function useLocalDay() {
  const [day, setDay] = useState<number | null>(null);
  useEffect(() => {
    setDay(new Date().getDay());
  }, []);
  return day;
}

/**
 * Compact status pill, designed to float over the hero food photo. Translucent
 * dark glass + gold/white text so it stays legible on any image.
 */
export default function WeeklyStatus() {
  const day = useLocalDay();
  const phase = day === null ? DEFAULT_PHASE : (PHASES[day] ?? DEFAULT_PHASE);

  return (
    <div
      aria-label="This week's supper club status"
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] shadow-lg backdrop-blur-md ${
        phase.urgent
          ? "border-gold-400/60 bg-black/40 text-gold-100"
          : "border-white/25 bg-black/40 text-white"
      }`}
    >
      <span
        className={`status-dot inline-block h-2 w-2 shrink-0 rounded-full ${
          phase.urgent ? "bg-gold-400" : "bg-green-400"
        }`}
        aria-hidden="true"
      />
      {phase.eyebrow}
    </div>
  );
}

/**
 * Quiet 7-dot ritual timeline for the light content band below the photo.
 * Orients the member in the weekly cycle without competing with the hero.
 */
export function WeeklyTimeline() {
  const day = useLocalDay();
  const activeRitual = day === null ? 0 : (RITUAL_INDEX[day] ?? 0);

  return (
    <ol
      className="mx-auto flex max-w-[420px] items-center justify-between"
      aria-hidden="true"
    >
      {RITUAL.map((label, i) => {
        const isActive = i === activeRitual;
        const isPast = i < activeRitual;
        return (
          <li key={label} className="flex flex-1 flex-col items-center gap-2">
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
  );
}
