export interface BlogPostDef {
  slug: string;
  title: string;
  dataKey: string;
  date: string;
  excerpt: string;
}

export const BLOG_POSTS: BlogPostDef[] = [
  {
    slug: "contract-and-consulting-support-in-the-life-sciences-industry",
    title: "Contract and Consulting Support in the Life Sciences Industry",
    dataKey: "blog-contract-consulting",
    date: "2022-12-05",
    excerpt: "Why life science companies should hire contract employees and how flexible resourcing supports growth.",
  },
  {
    slug: "483-warning-letters-how-to-resolve-them",
    title: "483 Warning Letters & How to Resolve Them",
    dataKey: "blog-483-warning",
    date: "2022-11-29",
    excerpt: "What FDA 483 warning letters are and proven steps to resolve compliance findings.",
  },
  {
    slug: "3d-printing-of-medical-devices",
    title: "3D Printing of Medical Devices",
    dataKey: "blog-3d-printing",
    date: "2022-07-26",
    excerpt: "How 3D printing met urgent PPE demand and what it means for medical device regulation.",
  },
  {
    slug: "compounding-outsourcing-facilities-current-good-manufacturing",
    title: "Compounding, Outsourcing Facilities, Current Good Manufacturing",
    dataKey: "blog-compounding",
    date: "2022-01-27",
    excerpt: "Regulatory frameworks governing compounded drugs and outsourcing facilities.",
  },
  {
    slug: "fda-oversight-for-medical-devices-insight-into-regulatory-process",
    title: "FDA Oversight for Medical Devices—Insight into Regulatory Process",
    dataKey: "blog-fda-devices",
    date: "2021-11-29",
    excerpt: "An overview of how the FDA regulates medical devices from development through market.",
  },
  {
    slug: "pharmacovigilance-then-and-now",
    title: "Pharmacovigilance, Then and Now",
    dataKey: "blog-pharmacovigilance",
    date: "2021-09-26",
    excerpt: "The evolution of pharmacovigilance across drug development, distribution, and post-market safety.",
  },
];

export function getBlogPost(slug: string): BlogPostDef | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
