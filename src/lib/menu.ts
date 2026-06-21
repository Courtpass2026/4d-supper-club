import type { SanityImageSource } from "@sanity/image-url";
// import { sanityClient } from "@/lib/sanity";

/**
 * Types mirror the `weeklyMenu` Sanity schema (src/sanity/schemaTypes/weeklyMenu.ts).
 */
export type DishCategory = "Entrée" | "Side" | "Dessert";

export type Dish = {
  name: string;
  description: string;
  price: number;
  category: DishCategory;
  dietaryTags?: string[];
  /** Sanity image reference (used once a Sanity project is connected). */
  image?: SanityImageSource;
  /** Plain image URL — used by the mock data below and as a fallback. */
  imageUrl?: string;
  imageAlt?: string;
};

export type WeeklyMenu = {
  weekOf: string; // ISO date, e.g. "2026-06-22"
  title: string;
  description?: string;
  dishes: Dish[];
  isActive: boolean;
};

/** Display order for category section headers. */
export const CATEGORY_ORDER: DishCategory[] = ["Entrée", "Side", "Dessert"];

/**
 * GROQ query for the current week's active menu.
 * Picks the most recent menu flagged `isActive`.
 */
export const ACTIVE_MENU_QUERY = `*[_type == "weeklyMenu" && isActive == true] | order(weekOf desc)[0]{
  weekOf,
  title,
  description,
  isActive,
  dishes[]{
    name,
    description,
    price,
    category,
    dietaryTags,
    image
  }
}`;

/**
 * Fetch the active weekly menu.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  SWAP IN THE REAL SANITY FETCH HERE                                    │
 * │                                                                       │
 * │  Once NEXT_PUBLIC_SANITY_PROJECT_ID is set (see src/lib/sanity.ts),    │
 * │  uncomment the block below and delete the mock return. Chef Rich's     │
 * │  edits in Sanity Studio will then drive this page automatically.       │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 *   if (sanityClient) {
 *     return sanityClient.fetch<WeeklyMenu | null>(ACTIVE_MENU_QUERY);
 *   }
 */
export async function getActiveWeeklyMenu(): Promise<WeeklyMenu | null> {
  return MOCK_WEEKLY_MENU;
}

/**
 * Mock data matching the schema, so the page renders before Sanity is wired up.
 * Photos are 16:9 food shots from Unsplash. To see the empty state instead,
 * temporarily return `null` from `getActiveWeeklyMenu` above.
 */
export const MOCK_WEEKLY_MENU: WeeklyMenu = {
  weekOf: "2026-06-22",
  title: "This Week's Menu",
  description:
    "Seven dishes, made from scratch this week by Chef Rich. Order by Thursday for weekend delivery across Riverview.",
  isActive: true,
  dishes: [
    {
      name: "Pan-Seared Salmon with Dill Cream",
      description:
        "Crispy-skinned Atlantic salmon over lemon orzo, finished with a fresh dill crème fraîche.",
      price: 24,
      category: "Entrée",
      dietaryTags: ["Gluten-Free"],
      imageUrl:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=450&fit=crop&q=80",
      imageAlt: "Seared salmon fillet plated with herbs and lemon",
    },
    {
      name: "Braised Short Ribs over Polenta",
      description:
        "Fork-tender short ribs slow-braised in red wine, served on creamy parmesan polenta.",
      price: 28,
      category: "Entrée",
      dietaryTags: ["Gluten-Free"],
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=450&fit=crop&q=80",
      imageAlt: "Braised beef short ribs in rich sauce",
    },
    {
      name: "Roasted Chicken Provençal",
      description:
        "Herb-roasted half chicken with tomatoes, olives, and capers in a bright white-wine pan sauce.",
      price: 22,
      category: "Entrée",
      dietaryTags: ["Gluten-Free", "Dairy-Free"],
      imageUrl:
        "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=450&fit=crop&q=80",
      imageAlt: "Golden roasted chicken with herbs",
    },
    {
      name: "Wild Mushroom Risotto",
      description:
        "Slow-stirred arborio rice with seasonal wild mushrooms, thyme, and aged parmesan.",
      price: 19,
      category: "Entrée",
      dietaryTags: ["Vegetarian", "Gluten-Free"],
      imageUrl:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=450&fit=crop&q=80",
      imageAlt: "Creamy mushroom risotto in a bowl",
    },
    {
      name: "Maple-Roasted Root Vegetables",
      description:
        "Carrots, parsnips, and beets roasted with maple and rosemary. The perfect companion plate.",
      price: 9,
      category: "Side",
      dietaryTags: ["Vegan", "Gluten-Free"],
      imageUrl:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=450&fit=crop&q=80",
      imageAlt: "Tray of roasted root vegetables",
    },
    {
      name: "Four-Cheese Mac & Cheese",
      description:
        "Cavatappi baked in a velvety blend of cheddar, gruyère, fontina, and parmesan with a crisp top.",
      price: 11,
      category: "Side",
      dietaryTags: ["Vegetarian"],
      imageUrl:
        "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=800&h=450&fit=crop&q=80",
      imageAlt: "Baked macaroni and cheese with golden crust",
    },
    {
      name: "Flourless Chocolate Torte",
      description:
        "Dense, fudgy dark-chocolate torte dusted with cocoa and a touch of sea salt.",
      price: 10,
      category: "Dessert",
      dietaryTags: ["Gluten-Free", "Vegetarian"],
      imageUrl:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=450&fit=crop&q=80",
      imageAlt: "Slice of rich chocolate torte",
    },
    {
      name: "Vanilla Bean Cheesecake",
      description:
        "Classic New York–style cheesecake with a buttery graham crust and macerated berries.",
      price: 10,
      category: "Dessert",
      dietaryTags: ["Vegetarian"],
      imageUrl:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=450&fit=crop&q=80",
      imageAlt: "Slice of cheesecake topped with berries",
    },
  ],
};
