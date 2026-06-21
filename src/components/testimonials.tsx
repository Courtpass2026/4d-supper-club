const testimonials = [
  {
    quote:
      "We both work full-time and have two kids under six. 4D Supper Club gave us back our evenings. The food is incredible — my kids actually ask for seconds on vegetables now.",
    initials: "JM",
    name: "Jessica M.",
    loc: "Riverview, FL",
  },
  {
    quote:
      "I hired Chef Rich for my mom's 70th birthday dinner and every single guest asked for his number. The braised short ribs were out of this world. Truly a five-star experience at home.",
    initials: "DL",
    name: "David L.",
    loc: "Riverview, FL",
  },
  {
    quote:
      "I've tried every meal kit service and nothing compares. This isn't assemble-it-yourself — it's real food made by a real chef. Canceling my other subscriptions was the easiest decision ever.",
    initials: "KT",
    name: "Karen T.",
    loc: "Riverview, FL",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="mx-auto mb-14 max-w-[600px] text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-green-500">
            What Our Members Say
          </div>
          <h2 className="font-heading text-[clamp(1.6rem,3.5vw,2.25rem)] font-extrabold leading-tight tracking-tight text-gray-900">
            Riverview Families Love Supper Club
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="relative rounded-2xl border border-gray-200 bg-white p-8"
            >
              <span
                aria-hidden
                className="absolute left-6 top-4 font-serif text-5xl leading-none text-green-400"
              >
                &ldquo;
              </span>
              <blockquote className="mb-5 pt-6 text-[0.95rem] leading-relaxed text-gray-700">
                {t.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-[0.85rem] font-bold text-green-600">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {t.name}
                  </div>
                  <div className="text-xs text-gray-500">{t.loc}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
