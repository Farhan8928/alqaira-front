import { Link } from "react-router-dom";
import { LogoMark } from "@/shared/components/Logo";

export function AboutPage() {
  return (
    <div className="aq-page">
      <section className="bg-navy py-20 text-center text-white">
        <LogoMark size={56} />
        <h1 className="mt-5 font-display text-5xl">About Us</h1>
        <p className="mx-auto mt-3 max-w-xl px-4 text-sm text-white/70">
          ALQAIRA sells premium thobes, jubbas, kurta pajama and abayas for men, women and kids —
          good-quality clothing at a fair price.
        </p>
      </section>
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-sm leading-relaxed text-muted-foreground md:px-6">
        <p>
          We offer many styles — Saudi, Omani, Emirati and Moroccan thobes, kurta pajama and abayas.
          Each one is made from good-quality fabric with clean stitching and a comfortable fit.
        </p>
        <p>
          We have clothing for the whole family — stylish thobes and kurtas for men, abayas for
          women, and festive wear for kids. Every order is delivered across India with Cash on
          Delivery and easy returns.
        </p>
        <div className="aq-rule" />
        <p>Thank you for shopping with us. Browse our collection and find your favourite style.</p>
        <Link
          to="/shop"
          className="inline-block rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white"
        >
          Shop the Collection
        </Link>
      </section>
    </div>
  );
}
