import { Sparkles, Feather, Users, Truck } from "lucide-react";
import { Reveal } from "@/shared/components/Reveal";

/* USP / "why us" — restrained value props, the trust signal premium homepages
   surface near the top (clarity over clutter). */
const POINTS = [
  {
    icon: Sparkles,
    title: "Authentic Regional Styles",
    text: "Saudi, Omani, Emirati, Moroccan and designer cuts — true to heritage.",
  },
  {
    icon: Feather,
    title: "Premium TR Fabric",
    text: "Soft, breathable Terry Rayon with a refined, matte drape that lasts.",
  },
  {
    icon: Users,
    title: "For the Whole Family",
    text: "Men, women, kids and boys — thobes, abayas, pathani and kurta sets.",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    text: "Fast shipping, cash on delivery and easy 7-day returns, nationwide.",
  },
];

export function WhyUs() {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24">
        <Reveal className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.title} className="group text-center sm:text-left">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
