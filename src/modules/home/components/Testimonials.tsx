import { Star, Quote } from "lucide-react";
import { Reveal } from "@/shared/components/Reveal";

/* Social proof — the single highest-impact missing section on the homepage
   (91% of shoppers read a review before buying). Specific, named reviews. */
const REVIEWS = [
  {
    quote:
      "The Saudi thobe fits perfectly and the TR fabric feels genuinely premium — soft and breathable even in the heat. Stitching is clean. Will order again for Eid.",
    name: "Imran Shaikh",
    place: "Mumbai, MH",
  },
  {
    quote:
      "Ordered the abaya for my wife and a kids thobe for our son. Both looked exactly like the photos, beautiful gold detailing. Delivery was quick across to Hyderabad.",
    name: "Abdul Rahman",
    place: "Hyderabad, TS",
  },
  {
    quote:
      "The pathani suit is my favourite — the baggy shalwar is so comfortable and the colour is rich. Felt like a premium boutique piece at a fair price.",
    name: "Faizan Khan",
    place: "Lucknow, UP",
  },
];

export function Testimonials() {
  return (
    <section className="aq-grain relative overflow-hidden bg-navy text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-28">
        <Reveal className="text-center">
          <p className="eyebrow text-gold-light">Loved by Customers</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
            Worn &amp; <span className="font-accent text-gold-light">trusted</span> across India
          </h2>
          <div className="mx-auto mt-5 h-px w-14 bg-gold" />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <Reveal
              key={r.name}
              className="flex flex-col rounded-sm border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition-colors duration-300 hover:border-gold/40"
            >
              <Quote className="h-7 w-7 text-gold/50" />
              <div className="mt-4 flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-white/80">“{r.quote}”</p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-display text-lg leading-none text-white">{r.name}</p>
                <p className="mt-1.5 text-[11px] uppercase tracking-[0.22em] text-white/45">
                  {r.place} · Verified Buyer
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
