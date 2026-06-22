"use client";

import { useState } from "react";

const EVENT_TYPES = [
  "Private Party",
  "Corporate Event",
  "Wedding",
  "Birthday",
  "Other",
] as const;

const BUDGET_RANGES = [
  "Under $500",
  "$500–$1,000",
  "$1,000–$2,500",
  "$2,500+",
] as const;

type FormState = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guests: string;
  dietary: string;
  budget: string;
  details: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  eventDate: "",
  guests: "",
  dietary: "",
  budget: "",
  details: "",
};

// Fields that must be filled in before the request can be submitted.
const REQUIRED: (keyof FormState)[] = [
  "name",
  "email",
  "phone",
  "eventDate",
  "guests",
];

function todayISO(): string {
  const now = new Date();
  const tz = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
}

export default function CateringForm() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as the user starts correcting it.
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validate(): Partial<Record<keyof FormState, string>> {
    const next: Partial<Record<keyof FormState, string>> = {};
    for (const key of REQUIRED) {
      if (!values[key].trim()) next[key] = "This field is required.";
    }
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address.";
    }
    if (values.guests.trim() && Number(values.guests) < 1) {
      next.guests = "Enter at least 1 guest.";
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Focus the first invalid field for keyboard / screen-reader users.
      const firstKey = (Object.keys(found) as (keyof FormState)[])[0];
      document.getElementById(`cat-${firstKey}`)?.focus();
      return;
    }

    // ┌──────────────────────────────────────────────────────────────────┐
    // │  WIRE UP FORMSPREE HERE                                           │
    // │  Replace this block with a POST to your Formspree endpoint, e.g.: │
    // │                                                                  │
    // │    await fetch("https://formspree.io/f/{your-form-id}", {        │
    // │      method: "POST",                                             │
    // │      headers: { Accept: "application/json" },                    │
    // │      body: new FormData(e.currentTarget),                        │
    // │    });                                                           │
    // │                                                                  │
    // │  (or set <form action="https://formspree.io/f/{id}" method=...>) │
    // └──────────────────────────────────────────────────────────────────┘
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-[560px] rounded-2xl border border-green-200 bg-green-50 px-6 py-12 text-center sm:px-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
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
        <h2 className="mb-3 font-heading text-2xl font-extrabold tracking-tight text-gray-900">
          Thank you!
        </h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Chef Rich will be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-[640px]"
      aria-label="Catering request form"
    >
      <div className="grid grid-cols-1 gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="cat-name" label="Name" required error={errors.name}>
            <input
              id="cat-name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "cat-name-error" : undefined}
              className={inputClass(!!errors.name)}
            />
          </Field>
          <Field id="cat-phone" label="Phone" required error={errors.phone}>
            <input
              id="cat-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "cat-phone-error" : undefined}
              className={inputClass(!!errors.phone)}
            />
          </Field>
        </div>

        <Field id="cat-email" label="Email" required error={errors.email}>
          <input
            id="cat-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cat-email-error" : undefined}
            className={inputClass(!!errors.email)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="cat-eventType" label="Event type" error={errors.eventType}>
            <select
              id="cat-eventType"
              name="eventType"
              value={values.eventType}
              onChange={(e) => update("eventType", e.target.value)}
              className={selectClass(!!errors.eventType, !values.eventType)}
            >
              <option value="">Select an event type…</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field id="cat-eventDate" label="Event date" required error={errors.eventDate}>
            <input
              id="cat-eventDate"
              name="eventDate"
              type="date"
              min={todayISO()}
              value={values.eventDate}
              onChange={(e) => update("eventDate", e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.eventDate}
              aria-describedby={
                errors.eventDate ? "cat-eventDate-error" : undefined
              }
              className={inputClass(!!errors.eventDate)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="cat-guests" label="Number of guests" required error={errors.guests}>
            <input
              id="cat-guests"
              name="guests"
              type="number"
              min={1}
              inputMode="numeric"
              value={values.guests}
              onChange={(e) => update("guests", e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.guests}
              aria-describedby={errors.guests ? "cat-guests-error" : undefined}
              className={inputClass(!!errors.guests)}
            />
          </Field>
          <Field id="cat-budget" label="Budget range" error={errors.budget}>
            <select
              id="cat-budget"
              name="budget"
              value={values.budget}
              onChange={(e) => update("budget", e.target.value)}
              className={selectClass(!!errors.budget, !values.budget)}
            >
              <option value="">Select a budget…</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          id="cat-dietary"
          label="Dietary needs"
          error={errors.dietary}
          optional
        >
          <textarea
            id="cat-dietary"
            name="dietary"
            rows={3}
            placeholder="Any allergies or dietary requirements?"
            value={values.dietary}
            onChange={(e) => update("dietary", e.target.value)}
            className={`${inputClass(false)} resize-y`}
          />
        </Field>

        <Field
          id="cat-details"
          label="Additional details"
          error={errors.details}
          optional
        >
          <textarea
            id="cat-details"
            name="details"
            rows={4}
            placeholder="Tell us about your event — venue, timing, menu ideas, anything helpful."
            value={values.details}
            onChange={(e) => update("details", e.target.value)}
            className={`${inputClass(false)} resize-y`}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-green-500 px-8 py-4 text-base font-semibold text-gray-900 transition-all hover:-translate-y-px hover:bg-green-600 hover:shadow-md sm:w-auto"
      >
        Submit Request
      </button>
    </form>
  );
}

function inputClass(hasError: boolean): string {
  return `w-full rounded-lg border bg-white px-3.5 py-2.5 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/25"
      : "border-gray-300 focus:border-green-500 focus:ring-green-500/25"
  }`;
}

function selectClass(hasError: boolean, isPlaceholder: boolean): string {
  return `${inputClass(hasError)} ${isPlaceholder ? "text-gray-400" : ""}`;
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-gray-700"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {optional && (
          <span className="ml-1 font-normal text-gray-400">(optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
