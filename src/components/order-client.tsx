"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Dish } from "@/lib/menu";

/** Prefer an explicit mock `imageUrl`; otherwise show the placeholder. */
function resolveImageUrl(dish: Dish): string | null {
  return dish.imageUrl ?? null;
}

function formatPrice(price: number): string {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

/** Cart is keyed by dish name (unique within a weekly menu). */
type Cart = Record<string, number>;

export default function OrderClient({ dishes }: { dishes: Dish[] }) {
  const [cart, setCart] = useState<Cart>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const dishByName = useMemo(() => {
    const map = new Map<string, Dish>();
    for (const d of dishes) map.set(d.name, d);
    return map;
  }, [dishes]);

  const { itemCount, total, lines } = useMemo(() => {
    let count = 0;
    let sum = 0;
    const ls: { dish: Dish; qty: number }[] = [];
    for (const [name, qty] of Object.entries(cart)) {
      const dish = dishByName.get(name);
      if (!dish || qty <= 0) continue;
      count += qty;
      sum += qty * dish.price;
      ls.push({ dish, qty });
    }
    return { itemCount: count, total: sum, lines: ls };
  }, [cart, dishByName]);

  function setQty(name: string, qty: number) {
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[name];
      else next[name] = qty;
      return next;
    });
  }

  function add(name: string) {
    setQty(name, (cart[name] ?? 0) + 1);
  }

  function handleOrderPlaced() {
    setCart({});
    setCheckoutOpen(false);
  }

  return (
    <>
      {/* Dish grid — extra bottom padding leaves room for the sticky cart bar. */}
      <div
        className={`mx-auto max-w-[1120px] px-6 pb-16 ${
          itemCount > 0 ? "pb-32 sm:pb-28" : ""
        }`}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <OrderCard
              key={dish.name}
              dish={dish}
              qty={cart[dish.name] ?? 0}
              onAdd={() => add(dish.name)}
              onSetQty={(q) => setQty(dish.name, q)}
            />
          ))}
        </div>
      </div>

      {/* Sticky cart summary — hidden when the cart is empty. */}
      {itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <p className="font-heading text-base font-extrabold leading-tight text-gray-900">
                {formatPrice(total)}
              </p>
              <p className="text-sm text-gray-500">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your order
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-green-500 px-6 py-3 text-base font-semibold text-gray-900 transition-all hover:-translate-y-px hover:bg-green-600 hover:shadow-md sm:px-8"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <CheckoutSheet
          lines={lines}
          total={total}
          onClose={() => setCheckoutOpen(false)}
          onPlaced={handleOrderPlaced}
        />
      )}
    </>
  );
}

function OrderCard({
  dish,
  qty,
  onAdd,
  onSetQty,
}: {
  dish: Dish;
  qty: number;
  onAdd: () => void;
  onSetQty: (qty: number) => void;
}) {
  const imageUrl = resolveImageUrl(dish);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
      <div className="relative aspect-video w-full bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={dish.imageAlt ?? dish.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
            Photo coming soon
          </div>
        )}
        {qty > 0 && (
          <span className="absolute right-3 top-3 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-green-600 px-2 text-sm font-bold text-white shadow">
            {qty}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-bold leading-tight text-gray-900">
            {dish.name}
          </h3>
          <span className="shrink-0 font-heading text-lg font-extrabold text-green-600">
            {formatPrice(dish.price)}
          </span>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          {dish.description}
        </p>

        {dish.dietaryTags && dish.dietaryTags.length > 0 && (
          <ul className="mb-4 flex flex-wrap gap-1.5">
            {dish.dietaryTags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-green-50 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-green-600"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Add button turns into a quantity stepper once in the cart. */}
        <div className="mt-auto pt-1">
          {qty === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-5 py-3 text-base font-semibold text-gray-900 transition-all hover:-translate-y-px hover:bg-green-600 hover:shadow-md"
            >
              Add to Order
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border-[1.5px] border-green-500 p-1">
              <button
                type="button"
                onClick={() => onSetQty(qty - 1)}
                aria-label={`Remove one ${dish.name}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl font-bold text-green-600 transition-colors hover:bg-green-50"
              >
                &minus;
              </button>
              <span
                className="font-heading text-base font-bold text-gray-900"
                aria-live="polite"
              >
                {qty} in order
              </span>
              <button
                type="button"
                onClick={() => onSetQty(qty + 1)}
                aria-label={`Add one ${dish.name}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl font-bold text-green-600 transition-colors hover:bg-green-50"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CheckoutSheet({
  lines,
  total,
  onClose,
  onPlaced,
}: {
  lines: { dish: Dish; qty: number }[];
  total: number;
  onClose: () => void;
  onPlaced: () => void;
}) {
  const [placed, setPlaced] = useState(false);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Close on Escape; lock body scroll while the sheet is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  function todayISO(): string {
    const now = new Date();
    const tz = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tz).toISOString().slice(0, 10);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend yet — when Stripe / an order API is added, POST the cart +
    // form data here, then show the confirmation on success.
    setPlaced(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close checkout"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-gray-900/50 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-[480px] sm:rounded-2xl"
      >
        {placed ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#388e3c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2
              id={titleId}
              className="mb-3 font-heading text-2xl font-extrabold tracking-tight text-gray-900"
            >
              Order received!
            </h2>
            <p className="mb-8 max-w-[360px] text-base leading-relaxed text-gray-600">
              Thanks for your order. Chef Rich will confirm your delivery details
              by text shortly. Payment will be collected when we wire up
              checkout.
            </p>
            <button
              type="button"
              onClick={onPlaced}
              className="inline-flex items-center justify-center rounded-xl bg-green-500 px-8 py-3.5 text-base font-semibold text-gray-900 transition-all hover:-translate-y-px hover:bg-green-600 hover:shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2
                  id={titleId}
                  className="font-heading text-xl font-extrabold tracking-tight text-gray-900"
                >
                  Checkout
                </h2>
                <p className="text-sm text-gray-500">
                  {lines.reduce((n, l) => n + l.qty, 0)} items &middot;{" "}
                  {formatPrice(total)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Order summary */}
              <ul className="mb-6 space-y-2">
                {lines.map((l) => (
                  <li
                    key={l.dish.name}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-gray-700">
                      <span className="font-semibold text-gray-900">
                        {l.qty}&times;
                      </span>{" "}
                      {l.dish.name}
                    </span>
                    <span className="shrink-0 font-medium text-gray-900">
                      {formatPrice(l.dish.price * l.qty)}
                    </span>
                  </li>
                ))}
                <li className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </li>
              </ul>

              <form id="checkout-form" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 gap-4">
                  <Field label="Name" htmlFor="co-name">
                    <input
                      ref={firstFieldRef}
                      id="co-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Phone" htmlFor="co-phone">
                      <input
                        id="co-phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email" htmlFor="co-email">
                      <input
                        id="co-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Delivery address" htmlFor="co-address">
                    <input
                      id="co-address"
                      name="address"
                      type="text"
                      required
                      autoComplete="street-address"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Preferred delivery date" htmlFor="co-date">
                    <input
                      id="co-date"
                      name="deliveryDate"
                      type="date"
                      required
                      min={todayISO()}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Notes" htmlFor="co-notes" optional>
                    <textarea
                      id="co-notes"
                      name="notes"
                      rows={3}
                      placeholder="Gate codes, allergies, delivery instructions…"
                      className={`${inputClass} resize-y`}
                    />
                  </Field>
                </div>
              </form>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <button
                type="submit"
                form="checkout-form"
                className="inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-6 py-3.5 text-base font-semibold text-gray-900 transition-all hover:-translate-y-px hover:bg-green-600 hover:shadow-md"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/25";

function Field({
  label,
  htmlFor,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-gray-700"
      >
        {label}
        {optional && (
          <span className="ml-1 font-normal text-gray-400">(optional)</span>
        )}
      </label>
      {children}
    </div>
  );
}
