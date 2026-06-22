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
    if (built) return built.width(800).height(450).fit("crop").url();
  }
  return null;
}

function formatPrice(price: number): string {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

export default function MenuCard({ dish }: { dish: Dish }) {
  const imageUrl = resolveImageUrl(dish);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg">
      {/* 16:9 image */}
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
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-bold leading-tight text-gray-900">
            {dish.name}
          </h3>
          {typeof dish.price === "number" && (
            <span className="shrink-0 font-heading text-lg font-extrabold text-gray-900">
              {formatPrice(dish.price)}
            </span>
          )}
        </div>

        {dish.description && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
            {dish.description}
          </p>
        )}

        {dish.dietaryTags && dish.dietaryTags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {dish.dietaryTags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-gold-50 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-gold-700"
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
