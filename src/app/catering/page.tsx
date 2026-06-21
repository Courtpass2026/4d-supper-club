import type { Metadata } from "next";
import CateringForm from "@/components/catering-form";

export const metadata: Metadata = {
  title: "Catering — 4D Supper Club",
  description:
    "Let Chef Rich cater your next event in Riverview, FL — private parties, corporate events, weddings, and birthdays. Request a custom quote.",
};

export default function CateringPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white px-6 pt-16 pb-12 text-center sm:pt-20 sm:pb-14">
        <div className="mx-auto max-w-[720px]">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-green-500">
            Private Catering
          </div>
          <h1 className="mb-5 font-heading text-[clamp(2rem,6vw,3.25rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Let Us Cater Your Next Event
          </h1>
          <p className="mx-auto max-w-[560px] text-lg leading-relaxed text-gray-600">
            From intimate dinners to corporate gatherings, Chef Rich crafts a
            custom menu for your event. Tell us what you have in mind and
            we&apos;ll be in touch within 24 hours.
          </p>
        </div>
      </section>

      {/* Request form */}
      <section className="px-6 pb-20 pt-4 sm:pb-24">
        <CateringForm />
      </section>
    </main>
  );
}
