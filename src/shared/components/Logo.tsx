import { cn } from "@/lib/utils";

/**
 * ALQAIRA logo (public/alqaira-logo.png) — transparent PNG of the gold
 * calligraphic mark + ALQAIRA wordmark, with the navy background removed so it
 * sits cleanly on any surface (light header, navy footer, etc.). `size` is the
 * rendered HEIGHT; width follows the logo's natural aspect ratio.
 */

const SRC = "/alqaira-logo.png";

export function LogoMark({ size = 40 }: { size?: number; disc?: boolean }) {
  return (
    <img
      src={SRC}
      alt="ALQAIRA"
      height={size}
      className="w-auto object-contain"
      style={{ height: size }}
    />
  );
}

/**
 * Horizontal lockup — emblem + wordmark side by side — for headers, footers and
 * other wide contexts. `size` is the emblem height; the wordmark scales with it.
 * (The stacked single-image logo squashes badly in a short header, so we lay the
 * mark and wordmark out horizontally for a crisp, premium result.)
 */
export function Logo({
  size = 44,
  className,
}: {
  size?: number;
  className?: string;
  /** Accepted for call-site compatibility; the official asset is fixed. */
  tone?: "navy" | "light";
  showTagline?: boolean;
}) {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap: size * 0.22 }}
      aria-label="ALQAIRA"
    >
      <img
        src="/alqaira-mark.png"
        alt=""
        className="w-auto object-contain"
        style={{ height: size }}
      />
      <img
        src="/alqaira-wordmark.png"
        alt="ALQAIRA"
        className="w-auto object-contain"
        style={{ height: size * 0.46 }}
      />
    </span>
  );
}

/** Text wordmark — kept for places that want type only (e.g. compact footers). */
export function Wordmark({
  className,
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "light";
}) {
  return (
    <span
      className={cn("brand-mark text-xl", tone === "light" ? "text-white" : "text-navy", className)}
    >
      ALQAIRA
    </span>
  );
}
