import type { Metadata } from "next";
import PagePlaceholder from "@/components/page-placeholder";

export const metadata: Metadata = {
  title: "Order — 4D Supper Club",
  description:
    "Start your weekly supper club subscription. Online ordering is coming soon — email Chef Rich to get started today.",
};

export default function OrderPage() {
  return (
    <PagePlaceholder
      eyebrow="Order"
      title="Start Your Subscription"
      description="Online ordering is almost ready. In the meantime, email Chef Rich and we'll get your first week — shipped free — on the calendar."
    />
  );
}
