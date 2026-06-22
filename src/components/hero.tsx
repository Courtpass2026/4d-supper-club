import Link from "next/link";
import WeeklyStatus from "@/components/weekly-status";

const trust = [
  "No commitments",
  "Skip or cancel anytime",
  "Free Riverview delivery",
];

export default function Hero() {
  return (
    <section id="hero" className="bg-white">
      {/* ---------- The HERO: this week's dinner, in motion ----------
          A single full-bleed video of the food. It autoplays muted
          (required for iOS), plays once and rests on the final frame. No
          poster image — the container sits on a dark (#111827) background so
          there's no flash of a stock photo before the video paints; it just
          fades from black into the food. A slight scale zoom tightens the
          framing so you feel right at the table; the container clips the
          scaled-up edges. */}
      <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden bg-gray-900 sm:h-[52vh] lg:h-[66vh] lg:max-h-[680px]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scale(1.3)" }}
          autoPlay
          muted
          playsInline
          aria-label="A spread of freshly plated, scratch-made dinners from Chef Rich Dino"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Soft top scrim so the status pill stays legible over the video. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent"
        />

        {/* The only thing over the photo: a small, subtle status pill. */}
        <div className="absolute inset-x-0 top-5 flex justify-center px-6">
          <WeeklyStatus />
        </div>
      </div>

      {/* ---------- Conversion content, below the photo, on clean light bg ---------- */}
      <div className="px-6 pb-10 pt-6 text-center">
        <div className="mx-auto max-w-[720px]">
          <h1 className="mb-5 font-heading text-[clamp(2.2rem,8vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Restaurant-Quality Dinners,{" "}
            <span className="text-gold-600">Delivered to Your Door</span>
          </h1>

          <p className="mx-auto mb-9 max-w-[540px] text-[clamp(1.05rem,2vw,1.2rem)] font-light leading-relaxed text-gray-500">
            Chef Rich Dino prepares seasonal, scratch-made meals so you can skip
            the cooking and still gather around a great dinner.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-xl bg-green-500 px-8 py-3.5 text-base font-semibold text-gray-900 transition-all duration-200 hover:-translate-y-px hover:bg-green-600 hover:shadow-md"
            >
              Become a Member
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-800 transition-all duration-200 hover:-translate-y-px hover:border-gray-300 hover:bg-gray-50"
            >
              See This Week&apos;s Menu
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
            {trust.map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg className="text-gold-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                {t}
              </span>
            ))}
          </div>

          {/* Thin gold rule closes the hero and hands off to the cream
              confidence band below — a quiet divider, not a hard edge. */}
          <div className="mx-auto mt-9 h-px w-[60px] bg-gold-400/40" />
        </div>
      </div>
    </section>
  );
}
