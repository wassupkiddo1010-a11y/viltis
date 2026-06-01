"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Helpers ────────────────────────────────────────────────────────── */

function hash2(x: number, y: number) {
  return Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
}
function valueNoise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return (
    hash2(ix, iy)       * (1 - ux) * (1 - uy) +
    hash2(ix + 1, iy)   * ux       * (1 - uy) +
    hash2(ix, iy + 1)   * (1 - ux) * uy       +
    hash2(ix + 1, iy + 1) * ux     * uy
  );
}

/* ─── Canvas draw functions ──────────────────────────────────────────── */

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

// Card 1 (dark) — drifting noise dot field
const drawDotField: DrawFn = (ctx, w, h, t) => {
  const cols = 28, rows = 24;
  const cw = w / cols, ch = h / rows;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const n = valueNoise(x / cols * 4.5 + t * 0.2, y / rows * 4.5 + t * 0.14);
      const r = Math.max(0.3, n * 3.4);
      const a = n * 0.78 + 0.06;
      ctx.beginPath();
      ctx.arc((x + 0.5) * cw, (y + 0.5) * ch, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
      ctx.fill();
    }
  }
};

// Card 2 (teal) — topographic wave-dot interference
const drawWaveLines: DrawFn = (ctx, w, h, t) => {
  const lines = 36, pts = 80;
  for (let l = 0; l < lines; l++) {
    const baseY = h * (l + 0.5) / lines;
    const phase = l * 0.3 + t * 0.6;
    const amp = (h / lines) * 0.6;
    for (let p = 0; p < pts; p++) {
      const x = (p / pts) * w;
      const xr = (p / pts) * Math.PI * 4;
      const dy =
        Math.sin(xr + phase) * amp * 0.45 +
        Math.sin(xr * 1.65 + phase * 1.35) * amp * 0.3;
      ctx.beginPath();
      ctx.arc(x, baseY + dy, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(24,50,60,0.58)";
      ctx.fill();
    }
  }
};

// Card 3 (coral) — perspective radial ray burst
const drawRadialBurst: DrawFn = (ctx, w, h, t) => {
  const cx = w * 0.48, cy = h * 0.5;
  const maxR = Math.hypot(w, h) * 0.78;
  const rays = 32;
  const rot = t * 0.08;
  for (let r = 0; r < rays; r++) {
    const angle = (r / rays) * Math.PI * 2 + rot;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    let d = 8, step = 5;
    while (d < maxR) {
      const px = cx + cos * d, py = cy + sin * d;
      if (px >= -2 && px <= w + 2 && py >= -2 && py <= h + 2) {
        const a = (1 - d / maxR) * 0.52;
        const sz = Math.max(0.4, (d / maxR) * 2.4);
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,6,2,${a.toFixed(3)})`;
        ctx.fill();
      }
      step += (d / maxR) * 4.5;
      d += step;
    }
  }
};

// Card 4 (light/gray) — Möbius ribbon (twisted dotted surface)
const drawRibbon: DrawFn = (ctx, w, h, t) => {
  const cx = w / 2, cy = h / 2;
  const sc = Math.min(w, h) * 0.37;
  const ry = t * 0.24;
  const cosY = Math.cos(ry), sinY = Math.sin(ry);
  const uN = 96, vN = 20;
  for (let vi = 0; vi <= vN; vi++) {
    for (let ui = 0; ui <= uN; ui++) {
      const u = (ui / uN) * Math.PI * 2;
      const v = (vi / vN) * 2 - 1;
      const x3 = Math.cos(u) * (1 + v * 0.28 * Math.cos(u / 2));
      const y3 = Math.sin(u) * (1 + v * 0.28 * Math.cos(u / 2));
      const z3 = v * 0.28 * Math.sin(u / 2);
      const rx = x3 * cosY - z3 * sinY;
      const rz = x3 * sinY + z3 * cosY;
      const fov = 3.6;
      const s = fov / (fov + rz * 0.38);
      const depth = Math.max(0, (rz + 1.6) / 3.2);
      ctx.beginPath();
      ctx.arc(cx + rx * sc * s, cy + y3 * sc * s, Math.max(0.4, depth * 1.7), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(26,26,26,${(depth * 0.62).toFixed(3)})`;
      ctx.fill();
    }
  }
};

/* ─── AnimCanvas component ───────────────────────────────────────────── */

function AnimCanvas({ drawFn }: { drawFn: DrawFn }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const t0 = Date.now();

    function resize() {
      if (!canvas || !wrap) return;
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w;
      canvas.height = h;
    }

    function draw() {
      if (!canvas || !ctx || canvas.width === 0 || canvas.height === 0) return;
      const t = reduced ? 0 : (Date.now() - t0) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawFn(ctx, canvas.width, canvas.height, t);
    }

    function loop() {
      draw();
      if (!reduced) animId = requestAnimationFrame(loop);
    }

    // Delay first paint one frame so flexbox has resolved dimensions
    animId = requestAnimationFrame(() => {
      resize();
      loop();
    });

    const ro = new ResizeObserver(() => {
      resize();
      draw(); // repaint immediately after resize so static (reduced) mode stays fresh
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [drawFn, reduced]);

  return (
    <div ref={wrapRef} className="industry-card-ref__canvas-wrap">
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
        aria-hidden="true"
      />
    </div>
  );
}

/* ─── Card data ──────────────────────────────────────────────────────── */

type CardVariant = "dark" | "teal" | "coral" | "light";

interface IndustryCard {
  title: string;
  index: string;
  body: string;
  variant: CardVariant;
  drawFn: DrawFn;
}

const CARDS: IndustryCard[] = [
  {
    title: "Biologics",
    index: "01 / 04",
    variant: "dark",
    drawFn: drawDotField,
    body: "We support groundbreaking advancements in vaccines, gene therapies, cell therapy, recombinant proteins, and living medicines—navigating complex regulatory pathways to bring innovative therapies to market safely.",
  },
  {
    title: "Pharmaceuticals",
    index: "02 / 04",
    variant: "teal",
    drawFn: drawWaveLines,
    body: "We support discovery, development, and production of pharmaceutical drugs—helping organizations deliver safe, effective treatments with innovation and compliance at global scale.",
  },
  {
    title: "Medical Device",
    index: "03 / 04",
    variant: "coral",
    drawFn: drawRadialBurst,
    body: "From implantable devices to disposable products, we guide development and manufacturing to meet rigorous standards and improve patient outcomes worldwide.",
  },
  {
    title: "In-Vitro Diagnostics",
    index: "04 / 04",
    variant: "light",
    drawFn: drawRibbon,
    body: "We support IVD development for critical tests on bodily samples—helping organizations design, validate, and transition reliable diagnostics from lab to market.",
  },
];

/* ─── Hover expand ───────────────────────────────────────────────────── */

// Use the `flex` shorthand in inline style so the browser transitions all
// three flex values together. This is the most reliable cross-browser approach.
const EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // spring overshoot feel

function getCardStyle(i: number, hovered: number | null): React.CSSProperties {
  const grow = hovered === null ? 1 : hovered === i ? 2.5 : 0.5;
  return {
    flex: `${grow} 1 0`,
    transition: `flex 0.62s ${EASE}`,
  };
}

/* ─── Section ────────────────────────────────────────────────────────── */

export function IndustryCards({ noAnimation = false }: { noAnimation?: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const reduced = useReducedMotion();

  // When noAnimation=true (inside HeroScrollScene), the parent controls clip-path.
  const motionProps = (noAnimation || reduced)
    ? {}
    : {
        initial   : { clipPath: "inset(0 0% 0 100%)" },
        whileInView: { clipPath: "inset(0 0% 0 0%)" },
        viewport  : { once: true, amount: 0 },
        transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <motion.section
      className="industry-showcase"
      id="industries"
      {...motionProps}
    >
      <div className="container industry-showcase__inner">
        <header className="industry-showcase__header">
          <p className="industry-showcase__label">Industries We Support</p>
          <h2 className="industry-showcase__title">
            Specialized support across regulated life sciences markets
          </h2>
        </header>

        <div
          className="industry-showcase__deck"
          onMouseLeave={() => setHovered(null)}
        >
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={cn("industry-card-ref", `industry-card-ref--${card.variant}`)}
              style={getCardStyle(i, hovered)}
              onMouseEnter={() => setHovered(i)}
            >
              <h3 className="industry-card-ref__title">{card.title}</h3>
              <AnimCanvas drawFn={card.drawFn} />
              <p className="industry-card-ref__index">{card.index}</p>
              <p className="industry-card-ref__body">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
