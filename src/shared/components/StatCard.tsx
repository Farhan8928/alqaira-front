import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: LucideIcon;
  tone?: "navy" | "gold" | "success" | "info";
}

const TONE: Record<NonNullable<StatCardProps["tone"]>, string> = {
  navy: "bg-navy/10 text-navy",
  gold: "bg-gold/15 text-gold-dark",
  success: "bg-emerald-500/10 text-emerald-600",
  info: "bg-sky-500/10 text-sky-600",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "navy" }: StatCardProps) {
  return (
    <div className="aq-tile">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="aq-nums mt-2 text-2xl font-bold text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", TONE[tone])}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
