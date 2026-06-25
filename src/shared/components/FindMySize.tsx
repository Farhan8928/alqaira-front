import { useState } from "react";
import { X, Ruler, Check, ChevronDown } from "lucide-react";
import { THOBE } from "@/shared/data/sizeCharts";
import { useStoreSettings } from "@/modules/settings/hooks/useSettings";
import { cn } from "@/lib/utils";

/**
 * "Find My Size" for men's thobes — modelled on AL KAMEEZ: enter height
 * (ft/in or cm) + either chest or weight, get a recommended size. Reads the
 * (admin-editable) thobe chart so recommendations always match the live chart.
 * Chest is the most accurate input; weight is the easy fallback.
 */
export function FindMySize({
  open,
  onClose,
  onViewChart,
}: {
  open: boolean;
  onClose: () => void;
  onViewChart?: () => void;
}) {
  const { data: settings } = useStoreSettings();
  const [heightUnit, setHeightUnit] = useState<"ftin" | "cm">("ftin");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [cm, setCm] = useState("");
  const [bodyMode, setBodyMode] = useState<"chest" | "weight">("chest");
  const [chest, setChest] = useState("");
  const [weight, setWeight] = useState("");

  if (!open) return null;

  // Live thobe chart (admin override → built-in default).
  const override = settings?.sizeCharts?.thobe;
  const columns = override?.columns?.length ? override.columns : THOBE.columns;
  const rows = override?.rows?.length ? override.rows : THOBE.rows;
  const sizeKey = columns[0]?.key ?? "size";

  const heightIn =
    heightUnit === "cm"
      ? cm
        ? Number(cm) / 2.54
        : null
      : feet || inches
        ? (Number(feet) || 0) * 12 + (Number(inches) || 0)
        : null;

  const rec = recommend(rows, {
    heightIn,
    chest: bodyMode === "chest" && chest ? Number(chest) : null,
    weightKg: bodyMode === "weight" && weight ? Number(weight) : null,
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-sm border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border bg-navy px-5 py-4 text-white">
          <img src="/alqaira-logo.png" alt="ALQAIRA" className="h-10 w-auto shrink-0" />
          <div className="h-9 w-px bg-white/15" />
          <div className="min-w-0 flex-1">
            <h2 className="flex items-center gap-2 font-display text-xl leading-tight">
              <Ruler className="h-4 w-4 text-gold-light" /> Find My Size
            </h2>
            <p className="text-[11px] uppercase tracking-[0.24em] text-gold-light">Men's Thobe</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          {/* Height */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Your height</label>
            <Toggle
              options={[
                { v: "ftin", label: "ft / in" },
                { v: "cm", label: "cm" },
              ]}
              value={heightUnit}
              onChange={(v) => setHeightUnit(v as "ftin" | "cm")}
            />
          </div>
          <div className="mt-2">
            {heightUnit === "ftin" ? (
              <div className="flex gap-3">
                <RangeSelect
                  value={feet}
                  onChange={setFeet}
                  min={4}
                  max={6}
                  suffix="ft"
                  placeholder="Feet"
                />
                <RangeSelect
                  value={inches}
                  onChange={setInches}
                  min={0}
                  max={11}
                  suffix="in"
                  placeholder="Inches"
                />
              </div>
            ) : (
              <RangeSelect
                value={cm}
                onChange={setCm}
                min={145}
                max={200}
                suffix="cm"
                placeholder="Height (cm)"
                wide
              />
            )}
          </div>

          {/* Body metric */}
          <div className="mt-6 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Your body measurement</label>
            <Toggle
              options={[
                { v: "chest", label: "Chest" },
                { v: "weight", label: "Weight" },
              ]}
              value={bodyMode}
              onChange={(v) => setBodyMode(v as "chest" | "weight")}
            />
          </div>
          <div className="mt-2">
            {bodyMode === "chest" ? (
              <RangeSelect
                value={chest}
                onChange={setChest}
                min={34}
                max={58}
                suffix="in"
                placeholder="Chest (in)"
                wide
              />
            ) : (
              <RangeSelect
                value={weight}
                onChange={setWeight}
                min={45}
                max={130}
                suffix="kg"
                placeholder="Weight (kg)"
                wide
              />
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            For best accuracy, use your <strong>chest</strong> measurement rather than weight.
          </p>

          {/* Result */}
          {rec ? (
            <div className="mt-6 rounded-sm border border-gold/30 bg-secondary/50 p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold-dark">
                Recommended size
              </p>
              <p className="mt-1 font-display text-5xl text-foreground">{rec[sizeKey]}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Length <strong className="text-foreground">{String(rec.length)}"</strong> from your
                height · Width{" "}
                <strong className="text-foreground">
                  {String(rec[sizeKey])
                    .replace(/^\s*\d+\s*/, "")
                    .trim() || "—"}
                </strong>{" "}
                from your {bodyMode}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
                {rec.length != null && <span>Length {String(rec.length)}"</span>}
                {rec.chest != null && <span>Chest {String(rec.chest)}"</span>}
                {rec.shoulder != null && <span>Shoulder {String(rec.shoulder)}"</span>}
                {rec.sleeves != null && <span>Sleeves {String(rec.sleeves)}"</span>}
              </div>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-success">
                <Check className="h-3.5 w-3.5" /> About 95% accurate — please double-check the size
                chart.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-sm border border-dashed border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
              Enter your height and {bodyMode} to see your recommended size.
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-4 text-xs">
            {onViewChart && (
              <button
                onClick={onViewChart}
                className="font-semibold text-gold-dark underline-offset-2 hover:underline"
              >
                View full size chart
              </button>
            )}
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            This is a suggestion — you can choose a different size if you prefer.
          </p>
        </div>
      </div>
    </div>
  );
}

type Row = Record<string, string | number>;

/**
 * Two-axis recommendation (AL KAMEEZ style). A thobe MUST fit the chest (it
 * can't close otherwise), while length can flex — so:
 *   1. Chest is the hard filter: keep only sizes whose chest ≥ body chest.
 *   2. Among those, pick the length closest to the height (length ≈ height − 12"),
 *      then the snuggest width (smallest chest that still fits).
 * Weight (fallback) is converted to an estimated chest first.
 * Needs height AND one body metric (chest preferred).
 */
function recommend(
  rows: Row[],
  {
    heightIn,
    chest,
    weightKg,
  }: { heightIn: number | null; chest: number | null; weightKg: number | null },
): Row | null {
  if (!rows.length || !heightIn || (chest == null && weightKg == null)) return null;

  // Effective body chest (estimate from weight when chest isn't given:
  // 45–130 kg ≈ 34–58 in, the chart's chest span).
  const bodyChest =
    chest != null ? chest : 34 + ((Math.max(45, Math.min(130, weightKg as number)) - 45) / 85) * 24;

  const targetLen = heightIn - 12;

  // 1) sizes that actually fit the chest; if none, the largest chest available.
  let pool = rows.filter((r) => Number(r.chest) >= bodyChest);
  if (!pool.length) {
    const maxChest = Math.max(...rows.map((r) => Number(r.chest)));
    pool = rows.filter((r) => Number(r.chest) === maxChest);
  }

  // 2) closest length to the height, then snuggest width (smallest chest).
  return [...pool].sort((a, b) => {
    const dl = Math.abs(Number(a.length) - targetLen) - Math.abs(Number(b.length) - targetLen);
    return dl !== 0 ? dl : Number(a.chest) - Number(b.chest);
  })[0];
}

function Toggle({
  options,
  value,
  onChange,
}: {
  options: { v: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-full border border-border p-0.5">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            value === o.v ? "bg-navy text-white" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Dropdown picker over a fixed start→end range (AL KAMEEZ-style scroll select). */
function RangeSelect({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  placeholder,
  wide,
}: {
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  placeholder?: string;
  wide?: boolean;
}) {
  const opts: number[] = [];
  for (let v = min; v <= max; v += step) opts.push(v);
  return (
    <div className={cn("relative", wide ? "w-full" : "flex-1")}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-input bg-background px-4 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">{placeholder ?? "Select"}</option>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
            {suffix ? ` ${suffix}` : ""}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
