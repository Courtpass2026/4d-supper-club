import Link from "next/link";

const trust = [
  "No commitments",
  "Skip or cancel anytime",
  "Free Riverview delivery",
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="bg-gradient-to-b from-green-50 to-white px-6 pt-20 pb-24 text-center"
    >
      <div className="mx-auto max-w-[720px]">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-green-600 shadow-sm">
          <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Serving 200+ families in Riverview
        </div>

        <h1 className="mb-5 font-heading text-[clamp(2.2rem,8vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
          Restaurant-Quality Dinners,{" "}
          <span className="text-green-500">Delivered to Your Door</span>
        </h1>

        <p className="mx-auto mb-9 max-w-[540px] text-[clamp(1.05rem,2vw,1.2rem)] leading-relaxed text-gray-600">
          Chef Rich Dino prepares seasonal, scratch-made meals so you can skip
          the cooking and still gather around a great dinner.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-xl bg-green-500 px-8 py-3.5 text-base font-semibold text-gray-900 transition-all hover:-translate-y-px hover:bg-green-600 hover:shadow-md"
          >
            Start Your Subscription
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-xl border-[1.5px] border-green-500 px-8 py-3.5 text-base font-semibold text-green-600 transition-all hover:bg-green-50"
          >
            See This Week&apos;s Menu
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
          {trust.map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <svg className="text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
