import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PerformanceMode } from "@/components/site/performance-mode";
import { MobileViewRoot } from "@/components/site/mobile-view-root";
import { OrganizationJsonLd } from "@/components/site/json-ld";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [{ url: "/assets/viltis-logo.png", type: "image/png" }],
    apple: [{ url: "/assets/viltis-logo.png", type: "image/png" }],
    shortcut: "/assets/viltis-logo.png",
  },
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
        <OrganizationJsonLd />
        <PerformanceMode />
        <MobileViewRoot />
        {children}
      </body>
    </html>
  );
}
