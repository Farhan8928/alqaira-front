import { Instagram } from "lucide-react";
import { Reveal } from "@/shared/components/Reveal";

/* UGC / lookbook strip — premium homepages reuse styled imagery as social proof.
   Reuses the generated editorial shots; links out to the brand's Instagram. */
const SHOTS = [
  "/banners/cat-thobe-jubba.jpg",
  "/banners/slide-women.jpg",
  "/banners/cat-jacket.jpg",
  "/banners/cat-kids-kurta-pajama.jpg",
  "/banners/cat-pathani-suit.jpg",
  "/banners/cat-abaya.jpg",
];

const INSTA_URL = "https://instagram.com";

export function InstaGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-28">
      <Reveal className="text-center">
        <p className="eyebrow">@alqaira</p>
        <h2 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-5xl">
          Styled by <span className="font-accent text-gold-dark">our community</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Tag <span className="font-medium text-foreground">@alqaira</span> to be featured. Real
          looks, real occasions.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SHOTS.map((src, i) => (
          <a
            key={i}
            href={INSTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-sm bg-secondary aq-zoom"
          >
            <img src={src} alt="ALQAIRA on Instagram" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-navy/0 transition-colors duration-300 group-hover:bg-navy/45">
              <Instagram className="h-6 w-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
