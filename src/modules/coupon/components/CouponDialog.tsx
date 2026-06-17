import { useEffect, useState } from "react";
import { FormDialog } from "@/modules/common/FormDialog";
import { useCreateCoupon, useUpdateCoupon } from "../hooks/useCoupons";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import type { Coupon, CouponPayload } from "../types";

const empty: CouponPayload = {
  code: "",
  description: "",
  type: "percent",
  value: 10,
  minOrderValue: 0,
  maxDiscount: undefined,
  usageLimit: undefined,
  isActive: true,
};

export function CouponDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "create" | "edit";
  value: Coupon | null;
  onSuccess: () => void;
}) {
  const create = useCreateCoupon();
  const update = useUpdateCoupon();
  const [form, setForm] = useState<CouponPayload>(empty);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErr(null);
      setForm(
        mode === "edit" && value
          ? {
              code: value.code,
              description: value.description || "",
              type: value.type,
              value: value.value,
              minOrderValue: value.minOrderValue || 0,
              maxDiscount: value.maxDiscount,
              usageLimit: value.usageLimit,
              isActive: value.isActive,
            }
          : empty,
      );
    }
  }, [open, mode, value]);

  async function submit() {
    setErr(null);
    try {
      const payload = { ...form, code: form.code.toUpperCase() };
      if (mode === "edit" && value) await update.mutateAsync({ id: value.id, payload });
      else await create.mutateAsync(payload);
      toast.success(mode === "edit" ? "Coupon updated" : "Coupon created");
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  }

  const num = (v: string) => (v === "" ? undefined : Number(v));

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "Edit Coupon" : "New Coupon"}
      onSubmit={submit}
      isPending={create.isPending || update.isPending}
      error={err}
    >
      <div className="space-y-3">
        <Field label="Code">
          <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className={inp} placeholder="WELCOME10" />
        </Field>
        <Field label="Description">
          <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inp} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CouponPayload["type"] }))} className={inp}>
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </Field>
          <Field label="Value">
            <input type="number" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))} className={inp} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Min Order (₹)">
            <input type="number" value={form.minOrderValue ?? ""} onChange={(e) => setForm((f) => ({ ...f, minOrderValue: num(e.target.value) }))} className={inp} />
          </Field>
          <Field label="Max Discount (₹)">
            <input type="number" value={form.maxDiscount ?? ""} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: num(e.target.value) }))} className={inp} placeholder="(percent cap)" />
          </Field>
        </div>
        <Field label="Usage Limit">
          <input type="number" value={form.usageLimit ?? ""} onChange={(e) => setForm((f) => ({ ...f, usageLimit: num(e.target.value) }))} className={inp} placeholder="Blank = unlimited" />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active
        </label>
      </div>
    </FormDialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
const inp = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
