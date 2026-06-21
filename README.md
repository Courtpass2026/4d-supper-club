# 4D Supper Club

Marketing site for 4D Supper Club — Chef Rich Dino's chef-crafted meal delivery,
weekly supper club, and catering in Riverview, FL.

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS v4**.
Fonts: Inter (body) + DM Sans (headings) via `next/font`.

## Getting Started

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
```

## Structure

```
src/
  app/
    layout.tsx          Root layout (fonts, metadata, Nav + Footer)
    page.tsx            Landing page (composes the section components)
    menu|order|catering Placeholder routes
    globals.css         Tailwind v4 + ported design tokens
  components/            nav, hero, how-it-works, programs, testimonials,
                         about, faq, cta, footer, page-placeholder
```

The original static landing page is preserved at
`_archive/original-landing.html`.

## Design tokens

Ported from the original `index.html` into `globals.css` (`@theme`):

- **Primary green** `#4CAF50` (with `#388E3C` / `#66BB6A` / `#E8F5E9`)
- **Dark text** `#111827`, neutral gray scale down to `#F9FAFB`
- **Backgrounds** white / `#F9FAFB`
- **Content max-width** `1120px`

## Responsive testing

Mobile-first. The layout collapses to a single column below the `md` (768px)
Tailwind breakpoint and goes multi-column at `md`+. Desktop targets `1024px`
and `1280px`+.

Every release should be checked for **no horizontal scroll, no overflow, and
no truncation** at each target device viewport (CSS logical width):

| Device | CSS width |
| --- | --- |
| iPhone SE | 375px |
| iPhone 15 / 16 | 393px |
| **iPhone 17 Pro** | **402px** |
| Samsung Galaxy S24 / Pixel 9 | 412px |
| iPhone 15 / 16 Pro Max | 430px |
| **iPhone 17 Pro Max** | **440px** |
| Tablet | 768px |
| Desktop | 1024px, 1280px+ |

All phone widths sit below the `sm` (640px) breakpoint, so they share the base
mobile styles — 440px (iPhone 17 Pro Max) is currently the widest phone target.
Verified: zero horizontal overflow at every width above.
