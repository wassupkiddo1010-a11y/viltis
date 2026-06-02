import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { PerformanceMode } from "@/components/site/performance-mode";
import { MobileViewRoot } from "@/components/site/mobile-view-root";
import { MobileBottomNav } from "@/components/mobile/mobile-bottom-nav";

export const metadata: Metadata = {
  title: "Viltis | Life Sciences Consulting & Expert Resourcing",
  description:
    "Viltis provides specialized life sciences consulting and expert resourcing for pharmaceutical, biotech, medical device, and diagnostics companies.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#05070d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body suppressHydrationWarning>
        <PerformanceMode />
        <MobileViewRoot />
        {children}
        <Suspense fallback={null}>
          <MobileBottomNav />
        </Suspense>
      </body>
    </html>
  );
}
