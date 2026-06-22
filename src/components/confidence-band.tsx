const stats = [
  { num: "200+", label: "Families Served" },
  { num: "52", label: "Weeks Running" },
  { num: "4.9★", label: "Average Rating" },
];

/**
 * A warm cream "confidence band" that sits right under the hero: a single,
 * plainspoken claim plus three proof points. It reassures before the visitor
 * has to think — Riverview families, a full year running, near-perfect rating.
 *
 * Shares the same max-width + horizontal padding as every other section so
 * the heading, copy, and stats line up to the same grid as the cards below.
 */
export default function ConfidenceBand() {
  return (
    <section className="bg-[#faf8f5] px-6 py-16 md:px-8">
      <div className="mx-auto max-w-[1120px] text-center">
        <h2 className="mx-auto max-w-[18ch] font-heading text-[clamp(1.7rem,5vw,2.4rem)] font-extrabold leading-[1.18] tracking-tight text-gray-900">
          Serving <span className="text-gold-600">200+ Families</span> in
          Riverview Every Sunday
        </h2>
        <p className="mx-auto mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-gray-500 md:text-base">
          Fresh ingredients. Scratch-made recipes. Delivered to your door.
        </p>

        <div className="mt-9 flex justify-center gap-8 sm:gap-14">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-[clamp(1.6rem,6vw,2.1rem)] font-extrabold tracking-tight text-green-600">
                {s.num}
              </div>
              <div className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.04em] text-gray-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
