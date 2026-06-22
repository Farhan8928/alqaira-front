import { useState } from "react";
import { X, Check } from "lucide-react";
import { chartFor, recommend, type Row } from "@/shared/data/sizeCharts";
import { cn } from "@/lib/utils";

/**
 * Size Guide modal — branded with the ALQAIRA logo. Picks the right chart for
 * the product (men thobe/kurta by chest, kids thobe/kurta by age) and offers an
 * interactive "Find My Size" calculator plus the full measurement table.
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
  const [tab, setTab] = useState<"find" | "chart">("find");
  const [value, setValue] = useState("");

  const chart = chartFor(section, categoryName);
  if (!open || !chart) return null;

  const rec = recommend(chart, parseFloat(value));

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

        {/* Tabs */}
        <div className="flex border-b border-border px-5">
          {(["find", "chart"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors",
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "find" ? "Find My Size" : "Size Chart"}
              {tab === t && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gold" />}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto px-5 py-5">
          {tab === "find" ? (
            <div>
              <label className="block text-sm font-medium text-foreground">
                {chart.finder.label}
              </label>
              <p className="mt-1 text-xs text-muted-foreground">{chart.finder.hint}</p>
              <div className="mt-3 relative w-44">
                <input
                  type="number"
                  inputMode="decimal"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={chart.finder.placeholder}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {chart.finder.unit}
                </span>
              </div>

              {rec && (
                <div className="mt-6 rounded-sm border border-gold/30 bg-secondary/50 p-5 text-center">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-gold-dark">
                    Recommended size
                  </p>
                  <p className="mt-1 font-display text-5xl text-foreground">{rec[chart.sizeKey]}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
                    <span>Length {rec.length}"</span>
                    <span>Chest {rec.chest}"</span>
                    <span>Shoulder {rec.shoulder}"</span>
                    <span>Sleeves {rec.sleeves}"</span>
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-success">
                    <Check className="h-3.5 w-3.5" /> Best fit for your measurement
                  </p>
                </div>
              )}

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                Tip: for a looser, more traditional fall, choose one size up. Between two sizes? Go
                with the larger one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                    <tr
                      key={i}
                      className={cn("border-b border-border/60", rec === r && "bg-gold/10")}
                    >
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
                          {c.key === chart.sizeKey && rec === r && (
                            <span className="ml-1.5 text-[10px] font-medium uppercase text-gold-dark">
                              you
                            </span>
                          )}
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
          )}
        </div>
      </div>
    </div>
  );
}
