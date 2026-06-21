import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

/**
 * Sanity client configuration.
 *
 * These read from environment variables so Chef Rich's content backend can be
 * wired up later without touching code. Once a Sanity project exists, add to
 * `.env.local`:
 *
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *
 * Until a project id is present, `sanityClient` stays `null` and the app falls
 * back to mock data (see src/lib/menu.ts).
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // CDN gives fast, cached reads — perfect for a public marketing site.
      useCdn: true,
    })
  : null;

const imageBuilder = sanityClient ? imageUrlBuilder(sanityClient) : null;

/**
 * Build an optimized image URL from a Sanity image reference.
 * Returns `null` when no Sanity project is configured yet.
 */
export function urlForImage(source: SanityImageSource) {
  return imageBuilder ? imageBuilder.image(source) : null;
}
