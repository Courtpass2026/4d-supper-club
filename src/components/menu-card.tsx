import Image from "next/image";
import type { Dish } from "@/lib/menu";
import { urlForImage } from "@/lib/sanity";

/**
 * Resolve a dish photo URL: prefer an explicit `imageUrl` (mock data), then a
 * Sanity image reference (live data), otherwise `null` for the placeholder.
 */
function resolveImageUrl(dish: Dish): string | null {
  if (dish.imageUrl) return dish.imageUrl;
  if (dish.image) {
    const built = urlForImage(dish.image);
    if (built) return built.width(900).height(675).fit("crop").url();
  }
  return null;
}

function formatPrice(price: number): string {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

export default function MenuCard({ dish }: { dish: Dish }) {
  const imageUrl = resolveImageUrl(dish);

  return (
    <article className="group flex flex-col">
      {/* Food is the hero — large, editorial, near-full-bleed. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={dish.imageAlt ?? dish.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-400">
            Chef selections are being prepared
          </div>
        )}

        {/* Confidence overlays — kept to one corner each to avoid clutter. */}
        {dish.chefRecommended && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-wider text-gold-700 shadow-sm backdrop-blur">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Chef Recommended
          </span>
        )}
        {dish.availabilityNote && (
          <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-gray-900/85 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-wider text-white backdrop-blur">
            {dish.availabilityNote}
          </span>
        )}
      </div>

      {/* Type carries the design — dramatic scale, generous spacing. */}
      <div className="flex flex-1 flex-col px-1 pt-5">
        {dish.contextLabel && (
          <span className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold-600">
            {dish.contextLabel}
          </span>
        )}

        <div className="flex items-start justify-between gap-4">
          <h3 className="font-heading text-[1.75rem] font-bold leading-[1.1] tracking-tight text-gray-900">
            {dish.name}
          </h3>
          {typeof dish.price === "number" && (
            <span className="shrink-0 pt-1 font-heading text-xl font-bold tracking-tight text-gray-900">
              {formatPrice(dish.price)}
            </span>
          )}
        </div>

        {dish.description && (
          <p className="mt-2.5 text-[0.95rem] font-light leading-relaxed text-gray-500">
            {dish.description}
          </p>
        )}

        {dish.trustSignal && (
          <p className="mt-3.5 flex items-center gap-2 text-[0.8rem] font-medium text-gray-600">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
            {dish.trustSignal}
          </p>
        )}

        {dish.dietaryTags && dish.dietaryTags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {dish.dietaryTags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-gray-50 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-gray-500"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
