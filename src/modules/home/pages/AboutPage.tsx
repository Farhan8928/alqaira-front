import { Link } from "react-router-dom";
import { LogoMark } from "@/shared/components/Logo";

export function AboutPage() {
  return (
    <div className="aq-page">
      <section className="bg-navy py-20 text-center text-white">
        <LogoMark size={56} />
        <h1 className="mt-5 font-display text-5xl">Our Story</h1>
        <p className="mx-auto mt-3 max-w-xl px-4 text-sm text-white/70">
          ALQAIRA is a celebration of heritage menswear — thobes, jubbas and kurta pajama tailored
          for the modern man who values quality and timeless style.
        </p>
      </section>
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-sm leading-relaxed text-muted-foreground md:px-6">
        <p>
          From the crisp lines of a Saudi thobe to the flowing grace of a Moroccan kaftan, every
          ALQAIRA garment is crafted from premium fabric and finished with subtle detailing along the
          placket and cuffs. We blend tradition and innovation to deliver refined simplicity with a
          timeless presence.
        </p>
        <p>
          Our collections span Saudi, Omani, Emirati, Moroccan and designer styles for men, elegant
          abayas for women, and festive pieces for kids — so the whole family can wear ALQAIRA with
          pride.
        </p>
        <div className="aq-rule" />
        <p>
          Thank you for making us part of your wardrobe. Explore the collection and discover the
          craft behind every piece.
        </p>
        <Link to="/shop" className="inline-block rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white">
          Shop the Collection
        </Link>
      </section>
    </div>
  );
}
