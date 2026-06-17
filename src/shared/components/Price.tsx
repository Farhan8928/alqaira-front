import { formatCurrency, cn } from "@/lib/utils";

export function Price({
  price,
  compareAtPrice,
  className,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const showCompare = compareAtPrice != null && compareAtPrice > price;
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" } as const;
  return (
    <span className={cn("flex items-baseline gap-2 aq-nums", className)}>
      <span className={cn("font-semibold text-foreground", sizes[size])}>
        {formatCurrency(price)}
      </span>
      {showCompare && (
        <span className="text-sm text-muted-foreground line-through">
          {formatCurrency(compareAtPrice)}
        </span>
      )}
    </span>
  );
}
