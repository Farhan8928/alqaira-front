import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Truck, ShieldCheck, RefreshCw, Sparkles } from "lucide-react";
import { ProductGrid } from "@/modules/product/components/ProductGrid";
import { useFeaturedProducts, useNewArrivals } from "@/modules/product/hooks/useProducts";
import { useFeaturedCategories } from "@/modules/category/hooks/useCategories";

export function HomePage() {
  const { data: featured = [], isLoading: lf } = useFeaturedProducts();
  const { data: arrivals = [], isLoading: la } = useNewArrivals();
  const { data: categories = [] } = useFeaturedCategories();

  const heroImages = featured.map((p) => p.image).filter(Boolean).slice(0, 3) as string[];

  return (
    <div className="aq-page">
      {/* ── Hero — editorial split ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(60% 70% at 85% 20%, rgba(201,162,75,0.16) 0, transparent 60%), radial-gradient(50% 60% at 10% 90%, rgba(201,162,75,0.10) 0, transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-6 lg:grid-cols-2 lg:py-24">
          {/* Copy */}
          <div className="reveal">
            <p className="eyebrow text-gold-light">Premium Kurta &amp; Jubba · Est. ALQAIRA</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.04] md:text-7xl">
              Heritage tailoring,
              <br />
              <span className="text-gold-gradient">reimagined for today.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/65">
              Saudi, Omani, Emirati, Moroccan &amp; designer thobes, kurta pajama and abayas —
              crafted in premium fabric for the discerning man and family.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/shop?section=men" className="btn-gold group">
                Shop Men
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/shop?section=women"
                className="btn rounded-full border border-white/25 px-7 py-3 text-white hover:border-gold hover:text-gold"
              >
                Shop Women
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs uppercase tracking-widest text-white/40">
              <span>Free Shipping ₹4,999+</span>
              <span className="h-3 w-px bg-white/20" />
              <span>COD Available</span>
              <span className="h-3 w-px bg-white/20" />
              <span>Easy Returns</span>
            </div>
          </div>

          {/* Image montage */}
          <div className="reveal relative hidden h-[480px] lg:block">
            {heroImages[0] && (
              <div className="absolute right-0 top-0 h-[380px] w-[58%] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                <img src={heroImages[0]} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            {heroImages[1] && (
              <div className="absolute bottom-0 left-0 h-[300px] w-[46%] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                <img src={heroImages[1]} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="absolute bottom-8 right-6 z-10 rounded-xl bg-gold px-5 py-4 text-navy shadow-xl">
              <p className="font-display text-3xl leading-none">7</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest">Signature Styles</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-6">
          <Badge icon={Truck} title="Fast Delivery" desc="Pan-India shipping" />
          <Badge icon={ShieldCheck} title="Secure Payments" desc="Razorpay & COD" />
          <Badge icon={RefreshCw} title="Easy Returns" desc="7-day policy" />
          <Badge icon={Sparkles} title="Premium Fabric" desc="Crafted to last" />
        </div>
      </section>

      {/* ── Collections ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <Heading eyebrow="The Collections" title="Shop by Style" />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to={`/shop?section=${c.section}&category=${c.slug}`}
              className={`group relative overflow-hidden rounded-2xl bg-secondary aq-zoom ${
                i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[3/4]"
              }`}
            >
              {c.image && <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold-light">{c.section}</p>
                  <h3 className="mt-1 font-display text-2xl leading-tight text-white">{c.name}</h3>
                </div>
                <span className="flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full bg-white/15 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4 text-white" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <Heading eyebrow="Curated Selection" title="Featured Pieces" link="/shop" />
        <div className="mt-12">
          <ProductGrid products={featured} loading={lf} />
        </div>
      </section>

      {/* ── Editorial band ──────────────────────────────────────────────────── */}
      <section className="my-24 bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-6 lg:grid-cols-2">
          <div className="reveal">
            <div className="aq-rule" />
            <h2 className="mt-6 font-display text-4xl leading-tight md:text-6xl">
              The craft behind every ALQAIRA piece
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/65">
              From the crisp Najdi placket to the flowing Moroccan kaftan, each garment is tailored
              with subtle detailing along the placket and cuffs — refined simplicity with a timeless
              presence.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold hover:gap-3">
              Discover our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={featured[2]?.image || "/products/men-08.jpg"} alt="" className="aspect-[3/4] rounded-2xl object-cover ring-1 ring-white/10" />
            <img src={featured[3]?.image || "/products/women-02.jpg"} alt="" className="mt-10 aspect-[3/4] rounded-2xl object-cover ring-1 ring-white/10" />
          </div>
        </div>
      </section>

      {/* ── New arrivals ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <Heading eyebrow="Just Arrived" title="New Arrivals" link="/shop?sort=newest" />
        <div className="mt-12">
          <ProductGrid products={arrivals} loading={la} />
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-secondary/60 px-6 py-16 text-center">
          <p className="eyebrow">Join the ALQAIRA circle</p>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-4xl text-foreground md:text-5xl">
            Be first to new arrivals &amp; private offers
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 rounded-full border border-input bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Heading({ eyebrow, title, link }: { eyebrow: string; title: string; link?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl text-foreground md:text-5xl">{title}</h2>
        <div className="mt-4 aq-rule" />
      </div>
      {link && (
        <Link to={link} className="hidden shrink-0 items-center gap-1.5 text-sm font-medium uppercase tracking-widest text-gold-dark hover:gap-2.5 sm:flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Badge({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/12 text-gold-dark">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
