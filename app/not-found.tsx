import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="page-placeholder">
        <div className="page-placeholder__inner">
          <p className="page-placeholder__eyebrow">404</p>
          <h1 className="page-placeholder__title">Page not found</h1>
          <p className="page-placeholder__sub">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
          </p>
          <Link href="/" className="btn btn--primary btn--sm">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
