import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element when it scrolls into view (editorial scroll-storytelling).
 * Falls back to "always shown" when IntersectionObserver is unavailable or the
 * user prefers reduced motion. Reveals once, then disconnects.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
}
