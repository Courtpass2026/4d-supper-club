const steps = [
  {
    num: "Step 1",
    title: "Pick Your Plan",
    body: "Choose weekly meals for 2 or 4, select any dietary preferences, and set your delivery day.",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  {
    num: "Step 2",
    title: "We Cook & Deliver",
    body: "Chef Rich sources fresh, local ingredients and prepares every dish from scratch in our kitchen.",
    icon: (
      <>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </>
    ),
  },
  {
    num: "Step 3",
    title: "Heat, Serve, Enjoy",
    body: "Your meals arrive portioned and ready. Just heat, plate, and sit down to a chef-made dinner.",
    icon: (
      <>
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="mx-auto mb-14 max-w-[600px] text-center">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-green-500">
            How It Works
          </div>
          <h2 className="mb-4 font-heading text-[clamp(1.6rem,3.5vw,2.25rem)] font-extrabold leading-tight tracking-tight text-gray-900">
            Dinner on Your Table in Three Simple Steps
          </h2>
          <p className="text-lg leading-relaxed text-gray-500">
            We handle the shopping, the prep, and the delivery. All you do is eat.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <div key={s.num} className="px-6 py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-green-50">
                <svg className="text-green-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s.icon}
                </svg>
              </div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-green-500">
                {s.num}
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{s.title}</h3>
              <p className="text-[0.925rem] leading-relaxed text-gray-500">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
