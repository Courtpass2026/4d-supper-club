import Image from "next/image";

const programs = [
  {
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop&q=80",
    alt: "A beautifully plated family dinner with roasted vegetables and protein",
    tag: "Most Popular",
    title: "Weekly Supper Club",
    body: "Two or three chef-prepared entrees delivered each week. Enough to feed the whole family with zero effort.",
    items: [
      "Pan-Seared Salmon with Dill Cream",
      "Braised Short Ribs over Polenta",
      "Roasted Chicken Provencal",
      "Seasonal Veggie Risotto",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop&q=80",
    alt: "Catering spread with multiple dishes for a group gathering",
    tag: "Groups & Parties",
    title: "Private Catering",
    body: "Custom menus for 10 to 100 guests. We work with you to design the perfect spread for your event.",
    items: [
      "Birthdays & Anniversaries",
      "Corporate Lunches",
      "Holiday Gatherings",
      "Custom Dietary Menus",
    ],
  },
  {
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&q=80",
    alt: "Elegant special event dinner table setting with candlelight",
    tag: "Exclusive",
    title: "Special Events",
    body: "Multi-course tasting dinners, seasonal pop-ups, and themed culinary experiences — right in your home.",
    items: [
      "5-Course Tasting Menus",
      "Wine Pairing Dinners",
      "Seasonal Pop-Up Nights",
      "Cooking Demonstrations",
    ],
  },
];

export default function Programs() {
  return (
    <section id="menu" className="px-6 py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="mx-auto mb-14 max-w-[600px] text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-gold-600">
            Our Programs
          </div>
          <h2 className="mb-4 font-heading text-[clamp(1.6rem,3.5vw,2.25rem)] font-extrabold leading-tight tracking-tight text-gray-900">
            Something for Every Night &amp; Every Occasion
          </h2>
          <p className="text-lg leading-relaxed text-gray-500">
            From weeknight dinners to weekend celebrations, we&apos;ve got your
            table covered.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {programs.map((p) => (
            <div
              key={p.title}
              className="group overflow-hidden rounded-2xl border border-gray-200 border-t-4 border-t-gold-500 bg-white transition-all hover:-translate-y-1 hover:border-gray-300 hover:border-t-gold-500 hover:shadow-lg"
            >
              <div className="relative h-[200px] w-full bg-gray-100">
                <Image
                  src={p.img}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="mb-3 inline-block rounded-full bg-gold-50 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-gold-700">
                  {p.tag}
                </span>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  {p.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-500">
                  {p.body}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {p.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[0.85rem] text-gray-600"
                    >
                      <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
