import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useAdminSettings, useUpdateSettings } from "../hooks/useSettings";
import { PageLoader } from "@/shared/components/PageLoader";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import type { StoreSettings } from "../types";

export function SettingsPage() {
  const { data, isLoading } = useAdminSettings();
  const update = useUpdateSettings();
  const [form, setForm] = useState<StoreSettings | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) return <PageLoader />;

  function set<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
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
