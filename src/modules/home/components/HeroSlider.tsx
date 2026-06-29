import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";

export type HeroSlide = {
  image: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  cta: { label: string; to: string };
  cta2?: { label: string; to: string };
};

const AUTOPLAY_MS = 6500;

/**
 * Premium full-width hero slider — autoplay with a thin progress bar, an editorial
 * bottom control bar (slide counter + paired arrows, kept clear of the headline),
 * dot indicators, swipe + keyboard support and a slow Ken-Burns zoom on the active
 * slide. Pauses on hover/focus and respects prefers-reduced-motion. No carousel dep.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count, index]);

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
      className="relative h-[82vh] min-h-[560px] w-full overflow-hidden bg-navy text-white lg:h-[90vh]"
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
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!active}
          >
            <img
              src={s.image}
              alt=""
              className={`h-full w-full object-cover transition-transform ease-out ${
                active ? "scale-110 duration-[8000ms]" : "scale-100 duration-0"
              }`}
            />
            {/* Spot scrim — a light left-side gradient that fades out by ~58% so
               the image stays bright while the copy keeps contrast. A subtle
               bottom scrim only for the control bar. (No full-image darkening.) */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,24,58,0.78)_0%,rgba(22,24,58,0.30)_32%,rgba(22,24,58,0)_58%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(22,24,58,0.55)_0%,rgba(22,24,58,0)_24%)]" />

            {/* Copy */}
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
                <div
                  className={`max-w-2xl transition-all duration-[900ms] ease-out ${
                    active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-gold-light">
                    <span className="h-px w-8 bg-gold/60" />
                    {s.eyebrow}
                  </p>
                  <h1
                    className="mt-6 font-display font-semibold leading-[0.95] tracking-[-0.01em]"
                    style={{ fontSize: "clamp(2.5rem, 5.4vw, 5rem)" }}
                  >
                    {s.title}
                  </h1>
                  <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/70">
                    {s.subtitle}
                  </p>
                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <Link to={s.cta.to} className="btn-gold group">
                      {s.cta.label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    {s.cta2 && (
                      <Link
                        to={s.cta2.to}
                        className="group inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
                      >
                        {s.cta2.label}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Editorial control bar — counter · progress · arrows ──────────────── */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 pb-7 md:px-10 md:pb-9">
          {/* Counter */}
          <span className="aq-nums shrink-0 text-sm font-medium tracking-wider text-white/80">
            <span className="text-gold-light">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1.5 text-white/30">/</span>
            <span className="text-white/45">{String(count).padStart(2, "0")}</span>
          </span>

          {/* Progress line (restarts each slide; pauses on hover) */}
          <div className="relative h-px flex-1 bg-white/20">
            <span
              key={index}
              className="absolute inset-y-0 left-0 origin-left bg-gold"
              style={{
                width: "100%",
                transform: "scaleX(0)",
                animation: paused ? undefined : `hero-progress ${AUTOPLAY_MS}ms linear forwards`,
              }}
            />
          </div>

          {/* Dots (compact) */}
          {count > 1 && (
            <div className="hidden items-center gap-2 sm:flex">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-7 bg-gold" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Paired arrows */}
          {count > 1 && (
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur transition-colors hover:border-gold hover:bg-gold"
              >
                <ArrowLeft className="h-4 w-4 text-white transition-colors group-hover:text-navy" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur transition-colors hover:border-gold hover:bg-gold"
              >
                <ArrowRight className="h-4 w-4 text-white transition-colors group-hover:text-navy" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
