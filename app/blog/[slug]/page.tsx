import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ContentProse } from "@/components/site/content-prose";
import { ContactFormBlock } from "@/components/site/contact-form-block";
import { BLOG_POSTS, getBlogPost } from "@/lib/content/blog-catalog";
import { loadPageContent } from "@/lib/content/loader";
import { articleMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const content = loadPageContent(post.dataKey, post.title);
  return articleMetadata({
    title: post.title,
    description: content.excerpt,
    path: `/blog/${slug}`,
    publishedTime: post.date,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const content = loadPageContent(post.dataKey, post.title);
  const dateLabel = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="content-page">
        <PageHero
          eyebrow={dateLabel}
          title={post.title}
          subtitle={post.excerpt}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />
        <section className="content-page__body">
          <div className="content-page__layout">
            <ContentProse sections={content.sections} paragraphs={content.paragraphs} />
          </div>
        </section>
        <ContactFormBlock />
      </main>
      <Footer />
    </>
  );
}
