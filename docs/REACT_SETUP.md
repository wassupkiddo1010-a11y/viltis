# React + shadcn + Tailwind Setup

The live Viltis site is currently **static HTML/CSS/JS**. Testimonials use a vanilla slider matching `testimonial-slider.tsx`. React source lives in `components/ui/` for a future Next.js migration.

## Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

## 1. Create a Next.js + TypeScript app

```bash
npx create-next-app@latest viltis-web --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*"
cd viltis-web
```

## 2. Initialize shadcn/ui

```bash
npx shadcn@latest init
```

Recommended options:

- Style: **New York**
- Base color: **Slate**
- CSS variables: **Yes**

This creates:

- `components/ui/` — shared UI primitives (Button, Card, etc.)
- `lib/utils.ts` — `cn()` helper
- Tailwind config with design tokens in `app/globals.css`

## Why `components/ui/` matters

shadcn expects reusable primitives under **`components/ui`**. Keeping `testimonial-slider.tsx` there:

- Matches shadcn conventions and docs
- Allows `@/components/ui/...` imports across the app
- Keeps page sections separate from low-level UI

If your project uses a different folder, update `components.json` `"ui"` path or imports will break.

## 3. Copy Viltis components

Copy from this repo into the Next.js project:

- `components/ui/testimonial-slider.tsx`
- `components/ui/rotating-text.tsx`
- `lib/utils.ts`

## 4. Install dependencies

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

## 5. Use in a page

```tsx
import TestimonialSlider from "@/components/ui/testimonial-slider";

export default function AboutSection() {
  return (
    <section id="about">
      <TestimonialSlider />
    </section>
  );
}
```

## 6. Tailwind content paths

Ensure `tailwind.config.ts` includes:

```ts
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
],
```

## Static site (current)

No build step required. Open `index.html` in a browser or serve the folder:

```bash
python3 -m http.server 8770
```

Testimonials: `js/testimonial-slider.js` + markup in `index.html`.

Hero rotating text: `js/rotating-text.js` (slide mode) + `components/ui/rotating-text.tsx` for React migration.

Example in Next.js hero:

```tsx
import { RotatingText } from "@/components/ui/rotating-text";

<p>
  At Viltis, we provide effective solutions and highly skilled consultants for organizations of{" "}
  <RotatingText
    words={["pharmaceutical", "life sciences", "biotech", "medical device", "diagnostics"]}
    mode="slide"
    interval={2500}
    className="text-teal-400 font-medium"
  />
</p>
```
