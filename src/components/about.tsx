import Image from "next/image";

const stats = [
  { num: "15+", label: "Years Experience" },
  { num: "200+", label: "Families Served" },
  { num: "50+", label: "Rotating Dishes" },
];

export default function About() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14">
          <div className="relative aspect-[4/5] max-h-[360px] overflow-hidden rounded-2xl bg-gray-100 md:max-h-none">
            <Image
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=750&fit=crop&q=80"
              alt="Chef Rich Dino in the kitchen preparing a dish"
              fill
              sizes="(max-width: 768px) 100vw, 540px"
              className="object-cover"
            />
          </div>

          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-green-500">
              Meet Your Chef
            </div>
            <h2 className="mb-5 font-heading text-[clamp(1.6rem,3.5vw,2.25rem)] font-extrabold leading-tight tracking-tight text-gray-900">
              Chef Rich Dino
            </h2>
            <p className="mb-4 leading-[1.8] text-gray-600">
              With over 15 years in professional kitchens — from upscale Italian
              restaurants in New York to farm-to-table concepts in Florida — Rich
              brings big-city culinary chops to Riverview&apos;s dinner tables.
            </p>
            <p className="mb-4 leading-[1.8] text-gray-600">
              After years of cooking for strangers, Rich wanted to cook for
              neighbors. 4D Supper Club was born out of a simple belief: every
              family deserves to sit down to a great meal without the stress of
              making it happen.
            </p>
            <p className="mb-4 leading-[1.8] text-gray-600">
              Every dish is made from scratch using locally sourced ingredients
              whenever possible. No shortcuts, no compromises, no frozen anything.
            </p>

            <div className="mt-7 flex gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-[1.75rem] font-extrabold text-green-500">
                    {s.num}
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
