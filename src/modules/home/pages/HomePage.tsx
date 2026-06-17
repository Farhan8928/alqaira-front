import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductGrid } from "@/modules/product/components/ProductGrid";
import { useFeaturedProducts, useNewArrivals } from "@/modules/product/hooks/useProducts";
import { useCategories, useFeaturedCategories } from "@/modules/category/hooks/useCategories";
import { Reveal } from "@/shared/components/Reveal";

/* Muted, looped, <5MB clip of fabric movement → cinematic luxury video hero.
   Set to null to fall back to the editorial image montage. */
const HERO_VIDEO: string | null = "/hero.mp4";

/* Heritage notes per regional men's style — authentic detail is the strongest
   premium signal for menswear (competitor benchmark). Keyed by category slug. */
const REGION_BLURB: Record<string, string> = {
  "saudi-style-jubba": "Classic Saudi style with a crisp collar and clean front.",
  "omani-style-jubba": "Collarless Omani dishdasha with the signature tassel.",
  "emirati-style-jubba": "Simple, clean Emirati kandura with a front pocket.",
  "moroccan-kaftan-jubba": "Flowing Moroccan kaftan with detailed trims.",
  "designer-modern-jubba": "Modern, stylish thobes for a fresh look.",
};

export function HomePage() {
  const { data: featured = [], isLoading: lf } = useFeaturedProducts();
  const { data: arrivals = [], isLoading: la } = useNewArrivals();
  const { data: categories = [] } = useFeaturedCategories();
  const { data: menCategories = [] } = useCategories("men");

  const heroImages = featured
    .map((p) => p.image)
    .filter(Boolean)
    .slice(0, 3) as string[];
  const regions = menCategories.filter((c) => REGION_BLURB[c.slug]);

  return (
    <div className="aq-page">
      {/* ── Hero — editorial split with film grain ──────────────────────────── */}
      <section className="aq-grain relative flex min-h-[82vh] items-center overflow-hidden bg-navy text-white lg:min-h-[88vh]">
        {/* Optional cinematic background video — drop a muted, looped, <5MB clip
           of fabric movement at public/hero.mp4 and set HERO_VIDEO to enable.
           Falls back to the editorial image montage when null. */}
        {HERO_VIDEO && (
          <>
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={HERO_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              poster={heroImages[0] ?? undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/55" />
          </>
        )}

        <div
          className={`relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-14 md:px-6 lg:py-20 ${
            HERO_VIDEO ? "" : "lg:grid-cols-[1.05fr_0.95fr]"
          }`}
        >
          {/* Copy */}
          <div className="reveal max-w-2xl">
            <p className="eyebrow text-gold-light">For Men, Women &amp; Kids · Across India</p>
            {/* Clear, keyword-rich H1 — names the product in plain English the
               Indian audience understands instantly (and ranks for those terms). */}
            <h1
              className="mt-5 font-display font-semibold leading-[0.98]"
              style={{ fontSize: "clamp(2.25rem, 4.4vw, 4.25rem)" }}
            >
              Premium Thobes, Jubbas
              <br />
              &amp; <span className="font-accent text-gold-light">Abayas</span>.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
              Saudi, Omani, Emirati, Moroccan and designer thobes, kurta pajama and abayas — made
              from premium fabric for the whole family.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
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
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
              <span>Free Shipping ₹4,999+</span>
              <span className="h-1 w-1 rounded-full bg-gold/70" />
              <span>Cash on Delivery</span>
              <span className="h-1 w-1 rounded-full bg-gold/70" />
              <span>Easy Returns</span>
            </div>
          </div>

          {/* Image montage — varied radii for an editorial, hand-set feel */}
          {!HERO_VIDEO && (
            <div className="reveal relative hidden h-[520px] lg:block">
              {heroImages[0] && (
                <div className="absolute right-0 top-0 h-[420px] w-[58%] overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/10">
                  <img src={heroImages[0]} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              {heroImages[1] && (
                <div className="absolute bottom-0 left-0 h-[340px] w-[46%] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/10">
                  <img src={heroImages[1]} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="absolute bottom-10 right-8 z-10 rounded-sm border border-gold/40 bg-navy/80 px-5 py-4 text-gold-light backdrop-blur">
                <p className="font-display text-4xl leading-none">7</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em]">
                  Signature Styles
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 lg:flex">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-px animate-pulse bg-gradient-to-b from-gold/70 to-transparent" />
        </div>
      </section>

      {/* ── Trust strip — typographic, not icon-card ────────────────────────── */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 text-center md:px-6">
          <Pill label="Pan-India Delivery" />
          <Dot />
          <Pill label="Secure Payments · Razorpay & COD" />
          <Dot />
          <Pill label="7-Day Easy Returns" />
          <Dot />
          <Pill label="Crafted in Premium Fabric" />
        </div>
      </section>

      {/* ── Collections ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <Reveal>
          <Heading eyebrow="Categories" title="Shop by Style" />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to={`/shop?section=${c.section}&category=${c.slug}`}
              className={`group relative overflow-hidden rounded-sm bg-secondary aq-zoom ${
                i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[3/4]"
              }`}
            >
              {c.image && (
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold-light">
                    {c.section}
                  </p>
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

      {/* ── Heritage by region — men's regional authenticity ───────────────── */}
      {regions.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <Reveal>
            <Heading
              eyebrow="For Men · By Region"
              title="Men's Thobes by Style"
              link="/shop?section=men"
            />
          </Reveal>
          <Reveal className="mt-12 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-5">
            {regions.map((c) => (
              <Link
                key={c.id}
                to={`/shop?section=men&category=${c.slug}`}
                className="group relative aspect-[3/4] w-[72%] shrink-0 snap-start overflow-hidden rounded-sm bg-secondary aq-zoom md:w-auto"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold-light">
                    {c.name.replace(/\s*(Style\s*)?Jubba$/i, "").trim() || c.name}
                  </p>
                  <h3 className="mt-1 font-display text-xl leading-tight text-white">{c.name}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/65">
                    {REGION_BLURB[c.slug]}
                  </p>
                </div>
              </Link>
            ))}
          </Reveal>
        </section>
      )}

      {/* ── Featured ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <Heading eyebrow="Top Picks" title="Featured Products" link="/shop" />
        </Reveal>
        <div className="mt-12">
          <ProductGrid products={featured} loading={lf} />
        </div>
      </section>

      {/* ── Editorial band ──────────────────────────────────────────────────── */}
      <section className="aq-grain relative my-24 overflow-hidden bg-navy text-white">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 md:px-6 lg:grid-cols-2">
          <div className="reveal">
            <div className="aq-rule" />
            <h2 className="mt-6 font-display text-4xl leading-[1.05] md:text-6xl">
              Made with <span className="font-accent text-gold-light">care</span>, in premium fabric
            </h2>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-white/65">
              Every thobe, jubba and abaya is made from good-quality fabric with clean stitching and
              a comfortable fit. Simple, elegant clothing that looks great and lasts long.
            </p>
            <Link
              to="/about"
              className="mt-9 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold hover:gap-3"
            >
              About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={featured[2]?.image || "/products/men-08.jpg"}
              alt=""
              className="aspect-[3/4] rounded-sm object-cover ring-1 ring-white/10"
            />
            <img
              src={featured[3]?.image || "/products/women-02.jpg"}
              alt=""
              className="mt-10 aspect-[3/4] rounded-[2rem] object-cover ring-1 ring-white/10"
            />
          </div>
        </div>
      </section>

      {/* ── New arrivals ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <Heading eyebrow="Just Added" title="New Arrivals" link="/shop?sort=newest" />
        </Reveal>
        <div className="mt-12">
          <ProductGrid products={arrivals} loading={la} />
        </div>
      </section>

      {/* ── Newsletter ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
        <Reveal className="relative overflow-hidden rounded-sm border border-gold/25 bg-secondary/60 px-6 py-16 text-center">
          <p className="eyebrow">Newsletter</p>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-4xl leading-[1.05] text-foreground md:text-5xl">
            Be the first to know about new arrivals &amp;{" "}
            <span className="font-accent text-gold-dark">special</span> offers
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
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </Reveal>
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
        <Link
          to={link}
          className="hidden shrink-0 items-center gap-1.5 text-sm font-medium uppercase tracking-[0.18em] text-gold-dark hover:gap-2.5 sm:flex"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70">
      {label}
    </span>
  );
}

function Dot() {
  return <span className="hidden h-1 w-1 rounded-full bg-gold/60 sm:inline-block" />;
}
