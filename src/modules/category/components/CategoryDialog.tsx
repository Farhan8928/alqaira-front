import { useEffect, useState } from "react";
import { FormDialog } from "@/modules/common/FormDialog";
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { slugify } from "@/lib/utils";
import type { Category, CategoryPayload } from "../types";

const empty: CategoryPayload = {
  name: "",
  slug: "",
  section: "men",
  description: "",
  image: "",
  displayOrder: 0,
  isFeatured: false,
  isActive: true,
};

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "create" | "edit";
  value: Category | null;
  onSuccess: () => void;
}) {
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const [form, setForm] = useState<CategoryPayload>(empty);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErr(null);
      setForm(
        mode === "edit" && value
          ? {
              name: value.name,
              slug: value.slug,
              section: value.section,
              description: value.description || "",
              image: value.image || "",
              displayOrder: value.displayOrder || 0,
              isFeatured: value.isFeatured || false,
              isActive: value.isActive ?? true,
            }
          : empty,
      );
    }
  }, [open, mode, value]);

  async function submit() {
    setErr(null);
    try {
      if (mode === "edit" && value) await update.mutateAsync({ id: value.id, payload: form });
      else await create.mutateAsync(form);
      toast.success(mode === "edit" ? "Category updated" : "Category created");
      onOpenChange(false);
      onSuccess();
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? "Edit Category" : "New Category"}
      onSubmit={submit}
      isPending={create.isPending || update.isPending}
      error={err}
    >
      <div className="space-y-3">
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                name: e.target.value,
                slug: mode === "create" ? slugify(e.target.value) : f.slug,
              }))
            }
            className={inp}
          />
        </Field>
        <Field label="Slug">
          <input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
            className={inp}
          />
        </Field>
        <Field label="Section">
          <select
            value={form.section}
            onChange={(e) =>
              setForm((f) => ({ ...f, section: e.target.value as CategoryPayload["section"] }))
            }
            className={inp}
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids &amp; Boys</option>
          </select>
        </Field>
        <Field label="Image URL">
          <input
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            className={inp}
            placeholder="https://…"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className={inp}
          />
        </Field>
        <Field label="Display Order">
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))}
            className={inp}
          />
        </Field>
        <div className="flex gap-6">
          <Check
            label="Featured"
            checked={!!form.isFeatured}
            onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
          />
          <Check
            label="Active"
            checked={!!form.isActive}
            onChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
          />
        </div>
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
function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{" "}
      {label}
    </label>
  );
}
const inp =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
