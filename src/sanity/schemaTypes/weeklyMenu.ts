import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The "Weekly Menu" document — the one thing Chef Rich edits each week.
 *
 * In Sanity Studio this renders as a friendly form: pick the week, write an
 * intro, add dish cards with photos and prices, then flip "Active" on to make
 * it the menu shown on the website.
 */
export const weeklyMenu = defineType({
  name: "weeklyMenu",
  title: "Weekly Menu",
  type: "document",
  fields: [
    defineField({
      name: "weekOf",
      title: "Week Of",
      description: "The Monday (or start date) this menu is for.",
      type: "date",
      options: { dateFormat: "dddd, MMMM D, YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "This Week's Menu",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Intro / Description",
      description: "Optional note that appears under the title.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "isActive",
      title: "Active (show this menu on the website)",
      description:
        "Turn this on for the current week's menu. Only one menu should be active at a time.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "dishes",
      title: "Dishes",
      type: "array",
      of: [
        defineArrayMember({
          name: "dish",
          title: "Dish",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "price",
              title: "Price (USD)",
              type: "number",
              validation: (rule) => rule.min(0),
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Entrée", value: "Entrée" },
                  { title: "Side", value: "Side" },
                  { title: "Dessert", value: "Dessert" },
                ],
                layout: "radio",
              },
              initialValue: "Entrée",
            }),
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "dietaryTags",
              title: "Dietary Tags",
              type: "array",
              of: [{ type: "string" }],
              options: {
                list: [
                  "Gluten-Free",
                  "Vegetarian",
                  "Vegan",
                  "Dairy-Free",
                  "Nut-Free",
                  "Keto",
                  "Spicy",
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "category",
              media: "image",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", weekOf: "weekOf", isActive: "isActive" },
    prepare({ title, weekOf, isActive }) {
      return {
        title: title ?? "Weekly Menu",
        subtitle: `${weekOf ?? "no date"}${isActive ? " · ACTIVE" : ""}`,
      };
    },
  },
});

export const schemaTypes = [weeklyMenu];
