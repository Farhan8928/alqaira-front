import { useEffect, useState } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { useAdminSettings, useUpdateSettings } from "../hooks/useSettings";
import { PageLoader } from "@/shared/components/PageLoader";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { EDITABLE_CHARTS, DEFAULT_CHARTS, type Chart } from "@/shared/data/sizeCharts";
import type { StoreSettings } from "../types";

type ChartCol = { key: string; label: string };
type ChartRow = Record<string, string | number>;
type ChartData = { columns: ChartCol[]; rows: ChartRow[] };

export function SettingsPage() {
  const { data, isLoading } = useAdminSettings();
  const update = useUpdateSettings();
  const [form, setForm] = useState<StoreSettings | null>(null);

  useEffect(() => {
    if (!data) return;
    // Seed each editable chart from saved data, falling back to built-in defaults.
    const sizeCharts: Record<string, ChartData> = {};
    for (const c of EDITABLE_CHARTS) {
      const saved = data.sizeCharts?.[c.id];
      const base = saved?.columns?.length ? saved : (DEFAULT_CHARTS[c.id] as ChartData);
      sizeCharts[c.id] = {
        columns: base.columns.map((col) => ({ ...col })),
        rows: base.rows.map((r) => ({ ...r })),
      };
    }
    setForm({ ...data, sizeCharts });
  }, [data]);

  if (isLoading || !form) return <PageLoader />;

  function set<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  function setChart(id: string, data: ChartData) {
    setForm((f) => (f ? { ...f, sizeCharts: { ...f.sizeCharts, [id]: data } } : f));
  }

  async function save() {
    try {
      await update.mutateAsync(form!);
      toast.success("Settings saved");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  return (
    <div className="aq-page max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Store Settings</h1>
        <p className="text-sm text-muted-foreground">
          Contact details, shipping rules and payments.
        </p>
      </div>

      <Card title="Store Identity">
        <Grid>
          <Field label="Store Name">
            <input
              value={form.storeName}
              onChange={(e) => set("storeName", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="Tagline">
            <input
              value={form.tagline ?? ""}
              onChange={(e) => set("tagline", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="Announcement bar text" full>
            <input
              value={form.announcement ?? ""}
              onChange={(e) => set("announcement", e.target.value)}
              className={inp}
            />
          </Field>
        </Grid>
      </Card>

      <Card title="Contact">
        <Grid>
          <Field label="Support Email">
            <input
              value={form.supportEmail ?? ""}
              onChange={(e) => set("supportEmail", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="Support Phone">
            <input
              value={form.supportPhone ?? ""}
              onChange={(e) => set("supportPhone", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="WhatsApp">
            <input
              value={form.whatsapp ?? ""}
              onChange={(e) => set("whatsapp", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="Address">
            <input
              value={form.addressLine ?? ""}
              onChange={(e) => set("addressLine", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="Instagram URL">
            <input
              value={form.instagram ?? ""}
              onChange={(e) => set("instagram", e.target.value)}
              className={inp}
            />
          </Field>
          <Field label="Facebook URL">
            <input
              value={form.facebook ?? ""}
              onChange={(e) => set("facebook", e.target.value)}
              className={inp}
            />
          </Field>
        </Grid>
      </Card>

      <Card title="Shipping & Payments">
        <Grid>
          <Field label="Free Shipping Threshold (₹)">
            <input
              type="number"
              value={form.freeShippingThreshold ?? 0}
              onChange={(e) => set("freeShippingThreshold", Number(e.target.value))}
              className={inp}
            />
          </Field>
          <Field label="Shipping Fee (₹)">
            <input
              type="number"
              value={form.shippingFee ?? 0}
              onChange={(e) => set("shippingFee", Number(e.target.value))}
              className={inp}
            />
          </Field>
        </Grid>
        <div className="mt-3 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.codEnabled}
              onChange={(e) => set("codEnabled", e.target.checked)}
            />{" "}
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.onlinePaymentEnabled}
              onChange={(e) => set("onlinePaymentEnabled", e.target.checked)}
            />{" "}
            Online Payment (Razorpay)
          </label>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Razorpay keys are configured in the backend <code>.env</code> file (RAZORPAY_KEY_ID /
          SECRET).
        </p>
      </Card>

      <Card title="Size Charts">
        <p className="mb-4 text-xs text-muted-foreground">
          These tables power the “Size Chart” button on product pages. Edit a value, add or remove a
          row, then Save. All measurements are in inches.
        </p>
        <div className="space-y-8">
          {EDITABLE_CHARTS.map((chart) => (
            <SizeChartEditor
              key={chart.id}
              chart={chart}
              value={form.sizeCharts?.[chart.id] ?? { columns: [], rows: [] }}
              onChange={(data) => setChart(chart.id, data)}
            />
          ))}
        </div>
      </Card>

      <button
        onClick={save}
        disabled={update.isPending}
        className="flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {update.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}{" "}
        Save Settings
      </button>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="aq-tile">
      <h2 className="mb-4 font-medium text-foreground">{title}</h2>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
const inp =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function SizeChartEditor({
  chart,
  value,
  onChange,
}: {
  chart: Chart;
  value: ChartData;
  onChange: (data: ChartData) => void;
}) {
  const { columns, rows } = value;

  function updateColLabel(ci: number, label: string) {
    onChange({ ...value, columns: columns.map((c, i) => (i === ci ? { ...c, label } : c)) });
  }
  function addCol() {
    const key = `c_${Math.random().toString(36).slice(2, 8)}`;
    onChange({
      columns: [...columns, { key, label: "New Column" }],
      rows: rows.map((r) => ({ ...r, [key]: "" })),
    });
  }
  function delCol(ci: number) {
    if (columns.length <= 1) return; // keep at least one column
    const key = columns[ci].key;
    onChange({
      columns: columns.filter((_, i) => i !== ci),
      rows: rows.map((r) => {
        const copy = { ...r };
        delete copy[key];
        return copy;
      }),
    });
  }
  function updateCell(ri: number, key: string, val: string) {
    onChange({ ...value, rows: rows.map((r, i) => (i === ri ? { ...r, [key]: val } : r)) });
  }
  function addRow() {
    onChange({ ...value, rows: [...rows, Object.fromEntries(columns.map((c) => [c.key, ""]))] });
  }
  function delRow(ri: number) {
    onChange({ ...value, rows: rows.filter((_, i) => i !== ri) });
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{chart.label}</h3>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((c, ci) => (
                <th key={c.key} className="px-1.5 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      value={c.label}
                      onChange={(e) => updateColLabel(ci, e.target.value)}
                      className="w-full rounded border border-input bg-background px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    {columns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => delCol(ci)}
                        aria-label="Delete column"
                        className="shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-9 px-1.5 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-b border-border/60">
                {columns.map((c) => (
                  <td key={c.key} className="px-1.5 py-1">
                    <input
                      value={String(r[c.key] ?? "")}
                      onChange={(e) => updateCell(ri, c.key, e.target.value)}
                      className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </td>
                ))}
                <td className="px-1.5 py-1 text-right">
                  <button
                    type="button"
                    onClick={() => delRow(ri)}
                    aria-label="Delete row"
                    className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-navy"
        >
          <Plus className="h-3.5 w-3.5" /> Add row
        </button>
        <button
          type="button"
          onClick={addCol}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-navy"
        >
          <Plus className="h-3.5 w-3.5" /> Add column
        </button>
      </div>
    </div>
  );
}
