import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Pick Your Plan",
    body: "Browse this week's menu and choose your dishes — no subscription, order only when you want to.",
    img: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=800&auto=format&fit=crop",
    alt: "Fresh ingredients laid out in the kitchen",
  },
  {
    num: "02",
    title: "We Cook & Deliver",
    body: "Chef Rich cooks everything from scratch Sunday morning and delivers it hot, right to your door.",
    img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop",
    alt: "Scratch-made meals packaged for delivery",
  },
  {
    num: "03",
    title: "Heat, Serve, Enjoy",
    body: "Warm it up when you're ready and sit down to a restaurant-quality dinner — no cooking, no cleanup.",
    img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=800&auto=format&fit=crop",
    alt: "A family dinner served at the table",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 px-6 py-16 md:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="mx-auto mb-12 max-w-[600px] text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-gold-600">
            How It Works
          </div>
          <h2 className="mb-4 font-heading text-[clamp(1.6rem,3.5vw,2.25rem)] font-extrabold leading-tight tracking-tight text-gray-900">
            Dinner on Your Table in Three Simple Steps
          </h2>
          <p className="text-lg leading-relaxed text-gray-500">
            We handle the shopping, the prep, and the delivery. All you do is eat.
          </p>
        </div>

        {/* Photo-over-text steps. On mobile the photo always stacks on top of
            its copy; on md+ the layout alternates side-to-side so the eye
            zig-zags down the page. */}
        <div className="flex flex-col gap-12 md:gap-16">
          {steps.map((s, i) => {
            const photoRight = i % 2 === 1;
            return (
              <div
                key={s.num}
                className="md:grid md:grid-cols-2 md:items-center md:gap-12"
              >
                <div
                  className={`relative h-[200px] overflow-hidden rounded-2xl bg-gray-100 shadow-[0_12px_28px_rgba(17,24,39,0.10)] md:h-[300px] ${
                    photoRight ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 540px"
                    className="object-cover"
                  />
                </div>

                <div className={`pt-4 md:pt-0 ${photoRight ? "md:order-1" : ""}`}>
                  <div className="font-heading text-[3rem] font-extrabold leading-none tracking-tight text-gold-500/45">
                    {s.num}
                  </div>
                  <h3 className="mt-1 font-heading text-[1.35rem] font-extrabold tracking-tight text-gray-900 md:text-[1.6rem]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-gray-500 md:text-base">
                    {s.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
