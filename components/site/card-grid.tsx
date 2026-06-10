import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface CardGridItem {
  title: string;
  href: string;
  excerpt?: string;
  meta?: string;
}

interface CardGridProps {
  items: CardGridItem[];
  columns?: 2 | 3;
}

export function CardGrid({ items, columns = 3 }: CardGridProps) {
  return (
    <ul className={`card-grid card-grid--${columns}`}>
      {items.map((item, index) => (
        <li key={item.href}>
          <Link href={item.href} className="card-grid__card">
            <span className="card-grid__accent" aria-hidden="true" />
            <div className="card-grid__top">
              {item.meta ? (
                <span className="card-grid__meta">{item.meta}</span>
              ) : (
                <span className="card-grid__index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              <ArrowUpRight className="card-grid__arrow" size={18} aria-hidden="true" />
            </div>
            <h2 className="card-grid__title">{item.title}</h2>
            {item.excerpt && <p className="card-grid__excerpt">{item.excerpt}</p>}
            <span className="card-grid__cta">Explore capability</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
