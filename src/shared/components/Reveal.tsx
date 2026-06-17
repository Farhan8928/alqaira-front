import { cn } from "@/lib/utils";
import { useReveal } from "@/shared/hooks/useReveal";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms for sequenced reveals. */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
};

/** Wrapper that fades + lifts its children into view on scroll. */
export function Reveal({ children, className, delay, as: Tag = "div" }: Props) {
  const { ref, shown } = useReveal();
  return (
    <Tag
      ref={ref as never}
      className={cn("reveal-on-scroll", shown && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
