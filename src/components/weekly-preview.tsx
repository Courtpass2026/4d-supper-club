import Image from "next/image";
import Link from "next/link";

/**
 * A small, hand-picked slice of this week's menu — three dishes shown as a
 * swipeable row of photo cards. It mirrors the menu page's dish shape (photo,
 * name, description, price, a trust badge) but is tuned for a quick,
 * confidence-building glance rather than the full ordering grid.
 */
type PreviewDish = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  badge: string;
  /** Visual tone for the badge pill. */
  badgeTone: "gold" | "green" | "dark";
};

const dishes: PreviewDish[] = [
  {
    name: "Herb-Roasted Chicken",
    description:
      "Pan-jus chicken over garlic mash with charred seasonal greens.",
    price: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
    imageAlt: "Herb-roasted chicken plate",
    badge: "Chef Recommended",
    badgeTone: "gold",
  },
  {
    name: "Braised Short Rib",
    description:
      "Slow-braised short rib with creamy parmesan polenta and gremolata.",
    price: 19,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
    imageAlt: "Braised short rib over polenta",
    badge: "Most Reordered",
    badgeTone: "green",
  },
  {
    name: "Pan-Seared Salmon",
    description:
      "Crisp-skin salmon with lemon-butter orzo and roasted asparagus.",
    price: 21,
    imageUrl:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600&auto=format&fit=crop",
    imageAlt: "Pan-seared salmon fillet",
    badge: "New This Week",
    badgeTone: "dark",
  },
];

const badgeToneClasses: Record<PreviewDish["badgeTone"], string> = {
  gold: "bg-gold-500 text-[#1a1407]",
  green: "bg-green-600 text-white",
  dark: "bg-gray-900/80 text-white",
};

export default function WeeklyPreview() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-[1120px]">
        {/* Header shares the section's px so its left edge lines up with the
            first card's left edge in the scroller below. */}
        <div className="flex items-baseline justify-between px-6 pb-5 md:px-8">
          <h2 className="font-heading text-[clamp(1.4rem,4.5vw,1.9rem)] font-extrabold tracking-tight text-gray-900">
            This Week&apos;s Selection
          </h2>
          <Link
            href="/menu"
            className="shrink-0 whitespace-nowrap text-sm font-bold text-gold-600 transition-colors hover:text-gold-700"
          >
            View Full Menu →
          </Link>
        </div>

        {/* Same px as the header → the row starts on the same grid line, with
            matching end padding so the last card clears the edge cleanly.
            scroll-pl matches the padding so snap rests the first card on the
            header's left edge instead of flush against the viewport. */}
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 scroll-pl-6 md:px-8 md:scroll-pl-8 [-webkit-overflow-scrolling:touch]">
          {dishes.map((dish) => (
            <article
              key={dish.name}
              className="flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] border border-[#f0eee9] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.06)]"
            >
              <div className="relative h-[190px] w-full overflow-hidden bg-gray-100">
                <Image
                  src={dish.imageUrl}
                  alt={dish.imageAlt}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
                <span
                  className={`absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.02em] backdrop-blur ${badgeToneClasses[dish.badgeTone]}`}
                >
                  {dish.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-heading text-[1.35rem] font-bold leading-[1.15] tracking-tight text-gray-900">
                  {dish.name}
                </h3>
                <p className="mt-1.5 min-h-[38px] text-[0.85rem] leading-snug text-gray-500">
                  {dish.description}
                </p>

                <div className="mt-3.5 flex items-center justify-between">
                  <div className="font-heading text-[1.15rem] font-extrabold text-gray-900">
                    ${dish.price}{" "}
                    <span className="text-[0.78rem] font-medium text-gray-500">
                      / plate
                    </span>
                  </div>
                  <Link
                    href="/order"
                    className="inline-flex h-10 items-center rounded-[10px] bg-green-600 px-4 font-heading text-[0.86rem] font-bold text-white transition-colors hover:bg-[#2e7d32]"
                  >
                    Reserve
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
