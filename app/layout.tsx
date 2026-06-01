import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viltis | Life Sciences Consulting & Expert Resourcing",
  description:
    "Viltis provides specialized life sciences consulting and expert resourcing for pharmaceutical, biotech, medical device, and diagnostics companies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
