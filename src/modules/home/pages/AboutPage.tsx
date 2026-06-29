import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="aq-page">
      <section className="aq-grain relative overflow-hidden bg-navy py-24 text-center text-white">
        <div className="relative mx-auto max-w-2xl px-4">
          <p className="eyebrow text-gold-light">Our Story</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">About ALQAIRA</h1>
          <div className="mx-auto mt-5 h-px w-14 bg-gold" />
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70">
            Premium thobes, jubbas, kurta pajama and abayas for men, women and kids — good-quality
            clothing at a fair price.
          </p>
        </div>
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
