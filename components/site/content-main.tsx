import type { ReactNode } from "react";

interface ContentMainProps {
  children: ReactNode;
}

/** Main reading column for sidebar layouts — glass panel alignment. */
export function ContentMain({ children }: ContentMainProps) {
  return <div className="content-main">{children}</div>;
}
