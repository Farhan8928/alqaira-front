import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  image: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  cta: { label: string; to: string };
  cta2?: { label: string; to: string };
};

const AUTOPLAY_MS = 6000;

/**
 * Premium full-width hero slider — autoplay, arrows, dot indicators, swipe and
 * keyboard support, with a slow Ken-Burns zoom on the active slide. Pauses on
 * hover/focus and respects prefers-reduced-motion. No external carousel dep.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Autoplay
  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  if (!count) return null;

  return (
    <section
      className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-navy text-white lg:h-[88vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!active}
          >
            {/* Image with slow Ken-Burns zoom while active */}
            <img
              src={s.image}
              alt=""
              className={`h-full w-full object-cover transition-transform ease-out ${
                active ? "scale-110 duration-[7000ms]" : "scale-100 duration-0"
              }`}
            />
            {/* Legibility gradients — strong on the left where copy sits */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-navy/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/20" />

            {/* Copy */}
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-5 md:px-6">
                <div
                  className={`max-w-xl transition-all duration-700 ${
                    active ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
                >
                  <p className="eyebrow text-gold-light">{s.eyebrow}</p>
                  <h1
                    className="mt-4 font-display font-semibold leading-[0.98]"
                    style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
                  >
                    {s.title}
                  </h1>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">
                    {s.subtitle}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link to={s.cta.to} className="btn-gold group">
                      {s.cta.label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    {s.cta2 && (
                      <Link
                        to={s.cta2.to}
                        className="btn rounded-full border border-white/30 px-7 py-3 text-white hover:border-gold hover:text-gold"
                      >
                        {s.cta2.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Arrows */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="group absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-navy/30 backdrop-blur transition-colors hover:border-gold hover:bg-navy/60 md:left-6"
          >
            <ChevronLeft className="h-5 w-5 text-white group-hover:text-gold" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="group absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-navy/30 backdrop-blur transition-colors hover:border-gold hover:bg-navy/60 md:right-6"
          >
            <ChevronRight className="h-5 w-5 text-white group-hover:text-gold" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-gold" : "w-2.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
