import type { Metadata } from "next";
import PagePlaceholder from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "This Week's Menu — 4D Supper Club",
  description:
    "See what Chef Rich is cooking up this week. The full rotating supper club menu is coming soon.",
};

export default function MenuPage() {
  return (
    <PagePlaceholder
      eyebrow="Weekly Menu"
      title="This Week's Menu"
      description="Our rotating weekly menu is on its way. Soon you'll be able to browse every chef-prepared entree before you order."
    />
  );
}
