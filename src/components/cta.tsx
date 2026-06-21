import Link from "next/link";

export default function Cta() {
  return (
    <section id="order" className="bg-gray-900 px-6 py-24 text-center text-white">
      <div className="mx-auto max-w-[1120px]">
        <h2 className="mb-4 font-heading text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-tight tracking-tight">
          Ready to Reclaim Your Evenings?
        </h2>
        <p className="mx-auto mb-9 max-w-[500px] text-lg leading-relaxed text-gray-400">
          Join 200+ Riverview families who traded cooking stress for chef-made
          dinners. Your first week ships free.
        </p>
        <Link
          href="/order"
          className="inline-flex items-center justify-center rounded-xl bg-green-500 px-10 py-4 text-[1.05rem] font-semibold text-white transition-colors hover:bg-green-400"
        >
          Get Started Today
        </Link>
      </div>
    </section>
  );
}
