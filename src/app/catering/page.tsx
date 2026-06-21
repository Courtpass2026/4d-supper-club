import type { Metadata } from "next";
import PagePlaceholder from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Catering — 4D Supper Club",
  description:
    "Private catering for 10 to 100 guests in Riverview. Custom menus for birthdays, corporate lunches, and special events. Request form coming soon.",
};

export default function CateringPage() {
  return (
    <PagePlaceholder
      eyebrow="Private Catering"
      title="Catering Requests"
      description="Planning a gathering for 10 to 100 guests? Our catering request form is coming soon. For now, email Chef Rich with your date and guest count for a custom quote."
    />
  );
}
