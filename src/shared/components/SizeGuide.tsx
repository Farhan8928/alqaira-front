import { X } from "lucide-react";
import { chartFor } from "@/shared/data/sizeCharts";
import { cn } from "@/lib/utils";

/**
 * Size Chart modal — branded with the ALQAIRA logo. Shows the measurement
 * table for the product's garment (men thobe/kurta, kids thobe/kurta).
 */
export function SizeGuide({
  open,
  onClose,
  section,
  categoryName,
}: {
  open: boolean;
  onClose: () => void;
  section?: string;
  categoryName?: string;
}) {
  const chart = chartFor(section, categoryName);
  if (!open || !chart) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-sm border border-border bg-card shadow-2xl">
        {/* Branded header */}
        <div className="flex items-center gap-4 border-b border-border bg-navy px-5 py-4 text-white">
          <img src="/alqaira-logo.png" alt="ALQAIRA" className="h-10 w-auto shrink-0" />
          <div className="h-9 w-px bg-white/15" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-xl leading-tight">{chart.label}</h2>
            <p className="text-[11px] uppercase tracking-[0.24em] text-gold-light">Inches</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chart table */}
        <div className="overflow-auto px-5 py-5">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                {chart.columns.map((c) => (
                  <th key={c.key} className="py-2 px-3 font-semibold first:pl-0">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.rows.map((r, i) => (
                <tr key={i} className="border-b border-border/60">
                  {chart.columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "py-2.5 px-3 first:pl-0",
                        c.key === chart.sizeKey
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {r[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            All measurements in inches, as per body dimension.
          </p>
        </div>
      </div>
    </div>
  );
}
