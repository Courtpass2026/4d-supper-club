import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes/weeklyMenu";

/**
 * Sanity Studio config — this is the CMS Chef Rich logs into to edit the menu.
 *
 * To go live:
 *   1. Run `npx sanity@latest init` to create a free Sanity project, OR create
 *      one at https://sanity.io/manage and copy its Project ID.
 *   2. Add to `.env.local`:
 *        NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
 *        NEXT_PUBLIC_SANITY_DATASET=production
 *   3. Run `npx sanity dev` to open Studio locally (or deploy with
 *      `npx sanity deploy`), then flip a Weekly Menu to "Active".
 */
export default defineConfig({
  name: "4d-supper-club",
  title: "4D Supper Club",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
