import type { ContentSection } from "@/lib/content/parse-body";

interface ContentProseProps {
  sections: ContentSection[];
  paragraphs?: string[];
}

function cleanBullet(text: string): string {
  return text.replace(/^:\s*/, "").trim();
}

export function ContentProse({ sections, paragraphs }: ContentProseProps) {
  if (sections.length > 0) {
    return (
      <div className="content-prose">
        {sections.map((section, i) => (
          <section key={i} className="content-prose__section">
            {section.heading && <h2 className="content-prose__heading">{section.heading}</h2>}
            {section.paragraphs.map((p, j) => (
              <p key={j} className="content-prose__p">{p}</p>
            ))}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="content-prose__list">
                {section.bullets.map((b, k) => (
                  <li key={k}>{cleanBullet(b)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="content-prose">
      {(paragraphs ?? []).map((p, i) => (
        <p key={i} className="content-prose__p">{p}</p>
      ))}
    </div>
  );
}
