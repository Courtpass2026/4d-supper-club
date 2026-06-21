import type { Metadata } from "next";
import Link from "next/link";
import OrderClient from "@/components/order-client";
import { getActiveWeeklyMenu } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Order This Week's Meals — 4D Supper Club",
  description:
    "Build your box from this week's chef-prepared menu. Free delivery across Riverview, FL. Order by Thursday for weekend delivery.",
};

export default async function OrderPage() {
  const menu = await getActiveWeeklyMenu();

  // ── Empty state ─────────────────────────────────────────────────────────
  if (!menu || menu.dishes.length === 0) {
    return (
      <main className="bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto flex min-h-[70vh] max-w-[640px] flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-green-600 shadow-sm">
            Coming Soon
          </div>
          <h1 className="mb-4 font-heading text-[clamp(2rem,6vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Ordering Opens Soon
          </h1>
          <p className="mb-9 max-w-[460px] text-lg leading-relaxed text-gray-600">
            Chef Rich is finalizing this week&apos;s dishes. Check back soon to
            build your box.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-green-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-px hover:bg-green-600 hover:shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white px-6 pt-16 pb-12 text-center sm:pt-20 sm:pb-14">
        <div className="mx-auto max-w-[720px]">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-green-500">
            Online Ordering
          </div>
          <h1 className="mb-5 font-heading text-[clamp(2rem,6vw,3.25rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Order This Week&apos;s Meals
          </h1>
          <p className="mx-auto max-w-[560px] text-lg leading-relaxed text-gray-600">
            Tap to build your box from Chef Rich&apos;s menu below. We deliver
            free across <span className="font-semibold text-gray-800">Riverview, FL</span>{" "}
            — order by Thursday for weekend delivery.
          </p>
        </div>
      </section>

      {/* Interactive ordering: cards, cart, and checkout (client component). */}
      <OrderClient dishes={menu.dishes} />
    </main>
  );
}
