import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FormDialog } from "@/modules/common/FormDialog";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";
import { useCategories } from "@/modules/category/hooks/useCategories";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { slugify } from "@/lib/utils";
import type { Product, ProductPayload, Section, VariantPayload } from "../types";

const empty: ProductPayload = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  category: "",
  section: "men",
  price: 0,
  compareAtPrice: undefined,
  images: [],
  variants: [{ size: "M", stock: 10 }],
  fabric: "",
  color: "",
  careInstructions: "",
  tags: [],
  isFeatured: false,
  isNewArrival: false,
  isActive: true,
};

export function ProductDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "create" | "edit";
  value: Product | null;
  onSuccess: () => void;
}) {
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const { data: categories = [] } = useCategories();
  const [form, setForm] = useState<ProductPayload>(empty);
  const [imagesText, setImagesText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    if (mode === "edit" && value) {
      setForm({
        name: value.name,
        slug: value.slug,
        shortDescription: value.shortDescription || "",
        description: value.description || "",
        category: value.category,
        section: value.section,
        price: value.price,
        compareAtPrice: value.compareAtPrice,
        images: value.images,
        variants: value.variants.map((v) => ({
          size: v.size,
          color: v.color,
          sku: v.sku,
          stock: v.stock,
        })),
        fabric: value.fabric || "",
        color: value.color || "",
        careInstructions: value.careInstructions || "",
        tags: value.tags,
        isFeatured: value.isFeatured,
        isNewArrival: value.isNewArrival,
        isActive: value.isActive,
      });
      setImagesText(value.images.join("\n"));
      setTagsText(value.tags.join(", "));
    } else {
      setForm(empty);
      setImagesText("");
      setTagsText("");
    }
  }, [open, mode, value]);

  const sectionCats = categories.filter((c) => c.section === form.section);

  function setVariant(idx: number, patch: Partial<VariantPayload>) {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)),
    }));
  }

  async function submit() {
    setErr(null);
    const payload: ProductPayload = {
      ...form,
      images: imagesText
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      tags: tagsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      compareAtPrice: form.compareAtPrice || undefined,
    };
    if (!payload.category) {
      setErr("Please select a category");
      return;
    }
    try {
      if (mode === "edit" && value) await update.mutateAsync({ id: value.id, payload });
      else await create.mutateAsync(payload);
      toast.success(mode === "edit" ? "Product updated" : "Product created");
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
      title={mode === "edit" ? "Edit Product" : "New Product"}
      onSubmit={submit}
      isPending={create.isPending || update.isPending}
      error={err}
      size="xl"
    >
      <div className="grid gap-4 md:grid-cols-2">
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
              setForm((f) => ({ ...f, section: e.target.value as Section, category: "" }))
            }
            className={inp}
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </Field>
        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className={inp}
          >
            <option value="">Select category…</option>
            {sectionCats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Price (₹)">
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            className={inp}
          />
        </Field>
        <Field label="Compare-at / MRP (₹)">
          <input
            type="number"
            value={form.compareAtPrice ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                compareAtPrice: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className={inp}
          />
        </Field>
        <Field label="Fabric">
          <input
            value={form.fabric}
            onChange={(e) => setForm((f) => ({ ...f, fabric: e.target.value }))}
            className={inp}
          />
        </Field>
        <Field label="Colour">
          <input
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
            className={inp}
          />
        </Field>
        <Field label="Short Description" className="md:col-span-2">
          <input
            value={form.shortDescription}
            onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
            className={inp}
          />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className={inp}
          />
        </Field>
        <Field label="Care Instructions" className="md:col-span-2">
          <input
            value={form.careInstructions}
            onChange={(e) => setForm((f) => ({ ...f, careInstructions: e.target.value }))}
            className={inp}
          />
        </Field>
        <Field label="Image URLs (one per line)" className="md:col-span-2">
          <textarea
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
            rows={3}
            className={inp}
            placeholder="https://…"
          />
        </Field>
        <Field label="Tags (comma separated)" className="md:col-span-2">
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className={inp}
            placeholder="premium, festive"
          />
        </Field>
      </div>

      {/* Variants */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Size Variants & Stock</span>
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({ ...f, variants: [...f.variants, { size: "", stock: 0 }] }))
            }
            className="flex items-center gap-1 text-xs font-medium text-gold-dark"
          >
            <Plus className="h-3.5 w-3.5" /> Add size
          </button>
        </div>
        <div className="space-y-2">
          {form.variants.map((v, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                placeholder="Size"
                value={v.size}
                onChange={(e) => setVariant(idx, { size: e.target.value })}
                className={`${inp} w-24`}
              />
              <input
                placeholder="Colour"
                value={v.color ?? ""}
                onChange={(e) => setVariant(idx, { color: e.target.value })}
                className={`${inp} w-28`}
              />
              <input
                placeholder="SKU"
                value={v.sku ?? ""}
                onChange={(e) => setVariant(idx, { sku: e.target.value })}
                className={`${inp} flex-1`}
              />
              <input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) => setVariant(idx, { stock: Number(e.target.value) })}
                className={`${inp} w-24`}
              />
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }))
                }
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-6">
        <Check
          label="Featured"
          checked={!!form.isFeatured}
          onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
        />
        <Check
          label="New Arrival"
          checked={!!form.isNewArrival}
          onChange={(v) => setForm((f) => ({ ...f, isNewArrival: v }))}
        />
        <Check
          label="Active (visible)"
          checked={!!form.isActive}
          onChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
        />
      </div>
    </FormDialog>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
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
