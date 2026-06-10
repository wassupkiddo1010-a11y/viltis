import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { CardGrid } from "@/components/site/card-grid";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { BLOG_POSTS } from "@/lib/content/blog-catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description: "News and insights on life sciences regulation, quality, pharmacovigilance, and consulting.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow="Insights"
          title="News & Insights"
          subtitle="Perspectives on regulation, quality systems, clinical operations, and life sciences consulting."
        />
        <section className="content-page__body">
          <div className="content-page__layout">
            <CardGrid
              columns={2}
              items={BLOG_POSTS.map((post) => ({
                title: post.title,
                href: `/blog/${post.slug}`,
                excerpt: post.excerpt,
                meta: new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              }))}
            />
          </div>
        </section>
        <ContactFormBlock />
      </main>
      <Footer />
    </>
  );
}
