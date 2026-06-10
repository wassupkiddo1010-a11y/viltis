import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "./site-config";

export function pageMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const desc = description ?? SITE_DESCRIPTION;
  const ogImage = image ?? `${SITE_URL}/assets/viltis-logo.png`;

  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [{ url: ogImage, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function articleMetadata({
  title,
  description,
  path,
  publishedTime,
}: {
  title: string;
  description?: string;
  path: string;
  publishedTime?: string;
}): Metadata {
  const base = pageMetadata({ title, description, path });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime,
    },
  };
}
