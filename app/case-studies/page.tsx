import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export const metadata = { title: "Case Studies | Viltis" };

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="page-placeholder">
        <div className="page-placeholder__inner">
          <p className="page-placeholder__eyebrow">Coming Soon</p>
          <h1 className="page-placeholder__title">Case Studies</h1>
          <p className="page-placeholder__sub">
            This page is under construction. Check back soon.
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
