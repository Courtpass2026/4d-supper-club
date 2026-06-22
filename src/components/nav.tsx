"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Menu", href: "/menu" },
  { label: "Catering", href: "/catering" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sticky nav shadow once the page is scrolled a touch.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-[100] border-b border-gray-200 bg-white/92 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-sm" : ""
        }`}
        role="banner"
      >
      <nav
        className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-gray-900"
          aria-label="4D Supper Club home"
          onClick={() => setOpen(false)}
        >
          4D <span className="text-gray-900">Supper Club</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/order"
              className="inline-flex items-center justify-center rounded-lg bg-green-500 px-[22px] py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:-translate-y-px hover:bg-green-600 hover:shadow-md"
            >
              Reserve Meals
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          type="button"
          className="flex w-6 flex-col gap-[5px] py-1 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 rounded bg-gray-700 transition-all ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 rounded bg-gray-700 transition-all ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 rounded bg-gray-700 transition-all ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
        </nav>
      </header>

      {/* Mobile slide-in menu — rendered as a sibling of <header> (not a
          child) so its `position: fixed` resolves against the viewport. The
          header's `backdrop-blur` would otherwise become the containing block
          and collapse this panel to a thin strip. */}
      <div
        id="mobile-nav"
        className={`fixed inset-x-0 bottom-0 top-16 z-[99] overflow-y-auto border-t border-gray-200 bg-white px-6 py-4 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block w-full border-b border-gray-100 py-3.5 text-lg font-medium text-gray-600"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/order"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-green-500 px-[22px] py-3 text-base font-semibold text-gray-900"
              onClick={() => setOpen(false)}
            >
              Reserve Meals
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
