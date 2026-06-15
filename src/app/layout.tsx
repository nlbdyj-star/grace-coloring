import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Grace Coloring | Find Peace Through Creativity",
  description:
    "Color Bible stories, download beautiful wallpapers, and grow closer to God every day. AI-generated Christian coloring pages and Bible story videos.",
  keywords: [
    "Bible coloring pages",
    "Christian coloring",
    "Bible stories",
    "Christian wallpapers",
    "faith activities",
    "prayer coloring",
  ],
  authors: [{ name: "Grace Coloring" }],
  creator: "Grace Coloring",
  publisher: "Grace Coloring",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gracecoloring.com",
    siteName: "Grace Coloring",
    title: "Grace Coloring | Find Peace Through Creativity",
    description:
      "Color Bible stories, download beautiful wallpapers, and grow closer to God every day.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Grace Coloring - Bible Coloring Pages and Stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grace Coloring | Find Peace Through Creativity",
    description:
      "Color Bible stories, download beautiful wallpapers, and grow closer to God every day.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://gracecoloring.com",
  },
  metadataBase: new URL("https://gracecoloring.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
