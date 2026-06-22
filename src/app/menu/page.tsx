import type { Metadata } from "next";
import Link from "next/link";
import MenuCard from "@/components/menu-card";
import {
  CATEGORY_ORDER,
  getActiveWeeklyMenu,
  type Dish,
  type DishCategory,
} from "@/lib/menu";

export const metadata: Metadata = {
  title: "This Week's Menu — 4D Supper Club",
  description:
    "See what Chef Rich is cooking this week — chef-prepared entrées, sides, and desserts delivered fresh in Riverview.",
};

function formatWeekOf(isoDate: string): string {
  // Parse as a local date (avoid UTC off-by-one) and format nicely.
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Group dishes by category, preserving the canonical category order. */
function groupByCategory(dishes: Dish[]): [DishCategory, Dish[]][] {
  return CATEGORY_ORDER.map(
    (category) =>
      [category, dishes.filter((d) => d.category === category)] as [
        DishCategory,
        Dish[],
      ],
  ).filter(([, items]) => items.length > 0);
}

export default async function MenuPage() {
  const menu = await getActiveWeeklyMenu();

  // ── Empty state ─────────────────────────────────────────────────────────
  if (!menu || menu.dishes.length === 0) {
    return (
      <main className="bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto flex min-h-[70vh] max-w-[640px] flex-col items-center justify-center px-6 py-24 text-center">
          {/* Logo lockup */}
          <div className="mb-6 text-2xl font-extrabold tracking-tight text-gray-900">
            4D <span className="text-gray-900">Supper Club</span>
          </div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">
            <span className="status-dot inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
            Members
          </div>
          <h1 className="mb-4 font-heading text-[clamp(2rem,6vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Next Menu Arrives Monday
          </h1>
          <p className="mb-9 max-w-[460px] text-lg font-light leading-relaxed text-gray-500">
            Chef selections are being prepared. Your next menu arrives Monday at
            9:00 AM — we&apos;ll have something special waiting.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border-[1.5px] border-gray-300 px-8 py-3.5 text-base font-semibold text-gray-800 transition-all hover:bg-gray-50"
            >
              Back to Home
            </Link>
            <a
              href="mailto:chef@4dsupperclub.com?subject=When%20is%20this%20week%27s%20menu%20live%3F"
              className="inline-flex items-center justify-center rounded-xl bg-green-500 px-8 py-3.5 text-base font-semibold text-gray-900 transition-all hover:-translate-y-px hover:bg-green-600 hover:shadow-md"
            >
              Email Chef Rich
            </a>
          </div>
        </div>
      </main>
    );
  }

  // ── Active menu ─────────────────────────────────────────────────────────
  const sections = groupByCategory(menu.dishes);

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white px-6 pt-16 pb-12 text-center sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-[720px]">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold-600">
            Week of {formatWeekOf(menu.weekOf)}
          </div>
          <h1 className="mb-5 font-heading text-[clamp(2rem,6vw,3.25rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            {menu.title}
          </h1>
          {menu.description && (
            <p className="mx-auto max-w-[560px] text-lg font-light leading-relaxed text-gray-500">
              {menu.description}
            </p>
          )}
        </div>
      </section>

      {/* Category sections */}
      <div className="mx-auto max-w-[1120px] px-6 pb-8">
        {sections.map(([category, dishes]) => (
          <section key={category} className="mb-20 scroll-mt-20">
            <div className="mb-8 flex items-center gap-5">
              <h2 className="font-heading text-[1.75rem] font-extrabold tracking-tight text-gray-900">
                {category}s
              </h2>
              <span className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish) => (
                <MenuCard key={dish.name} dish={dish} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Order Now CTA */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-[640px]">
          <h2 className="mb-4 font-heading text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-tight tracking-tight">
            Hungry Yet?
          </h2>
          <p className="mx-auto mb-9 max-w-[460px] text-lg font-light leading-relaxed text-gray-400">
            Select your meals from this week&apos;s menu. Reserve by Thursday for
            weekend delivery across Riverview.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center justify-center rounded-xl bg-green-500 px-10 py-4 text-[1.05rem] font-semibold text-gray-900 transition-all duration-200 hover:-translate-y-px hover:bg-green-400 hover:shadow-md"
          >
            Reserve This Week
          </Link>
        </div>
      </section>
    </main>
  );
}
