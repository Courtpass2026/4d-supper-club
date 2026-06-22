import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PagePlaceholder({ eyebrow, title, description }: Props) {
  return (
    <main className="bg-gradient-to-b from-green-50 to-white">
      <div className="mx-auto flex min-h-[70vh] max-w-[720px] flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-green-600 shadow-sm">
          Coming Soon
        </div>
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-green-500">
          {eyebrow}
        </div>
        <h1 className="mb-5 font-heading text-[clamp(2rem,6vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mb-9 max-w-[480px] text-lg leading-relaxed text-gray-600">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border-[1.5px] border-green-500 px-8 py-3.5 text-base font-semibold text-green-600 transition-all hover:bg-green-50"
          >
            Back to Home
          </Link>
          <a
            href="mailto:chef@4dsupperclub.com?subject=I%27d%20like%20to%20join%204D%20Supper%20Club"
            className="inline-flex items-center justify-center rounded-xl bg-green-500 px-8 py-3.5 text-base font-semibold text-gray-900 transition-all hover:-translate-y-px hover:bg-green-600 hover:shadow-md"
          >
            Email Chef Rich
          </a>
        </div>
      </div>
    </main>
  );
}
