import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "4D Supper Club — Chef-Crafted Meals Delivered in Riverview",
  description:
    "Chef Rich Dino delivers restaurant-quality meals to your door in Riverview. Weekly supper club, catering, and special events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="font-sans text-gray-800 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-base focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Nav />
        <div id="main-content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
