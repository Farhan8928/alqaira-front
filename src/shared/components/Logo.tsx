import { cn } from "@/lib/utils";

/**
 * ALQAIRA official logo (public/alqaira-logo.jpeg). The asset is a navy square
 * containing the gold calligraphic mark + ALQAIRA wordmark, so we render it
 * directly. `LogoMark` is the square badge; `Logo` is an alias used across the
 * header, footer, sidebar and auth panels.
 */

const SRC = "/alqaira-logo.jpeg";

export function LogoMark({ size = 40 }: { size?: number; disc?: boolean }) {
  return (
    <img
      src={SRC}
      alt="ALQAIRA"
      width={size}
      height={size}
      className="rounded-lg object-cover"
      style={{ width: size, height: size }}
    />
  );
}

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
    <img
      src={SRC}
      alt="ALQAIRA — Premium Kurta & Jubba"
      height={size}
      className={cn("rounded-lg object-cover", className)}
      style={{ width: size, height: size }}
    />
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
