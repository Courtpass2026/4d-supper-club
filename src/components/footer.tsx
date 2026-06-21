import Link from "next/link";

const navigate = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
];

const programs = [
  { label: "Weekly Supper Club", href: "/menu" },
  { label: "Private Catering", href: "/catering" },
  { label: "Special Events", href: "/catering" },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-white/10 bg-gray-900 px-6 pt-12 pb-8 text-gray-400"
      role="contentinfo"
    >
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="max-w-[280px] sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="mb-3 block text-lg font-extrabold tracking-tight text-green-600"
          >
            4D <span className="text-white">Supper Club</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-500">
            Chef-crafted meals delivered to your door in Riverview, FL. Made from
            scratch, served with love.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-300">
            Navigate
          </h4>
          {navigate.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="block py-1 text-sm text-gray-500 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-300">
            Programs
          </h4>
          {programs.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="block py-1 text-sm text-gray-500 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-300">
            Contact
          </h4>
          <a
            href="mailto:chef@4dsupperclub.com"
            className="block py-1 text-sm text-gray-500 transition-colors hover:text-white"
          >
            chef@4dsupperclub.com
          </a>
          <a
            href="tel:+18135551234"
            className="block py-1 text-sm text-gray-500 transition-colors hover:text-white"
          >
            (813) 555-1234
          </a>
          <span className="block py-1 text-sm text-gray-500">Riverview, FL</span>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1120px] flex-col items-center gap-3 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row sm:justify-between">
        <span>&copy; 2026 4D Supper Club. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" aria-label="Facebook" className="text-gray-500 transition-colors hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-500 transition-colors hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href="#" aria-label="TikTok" className="text-gray-500 transition-colors hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
