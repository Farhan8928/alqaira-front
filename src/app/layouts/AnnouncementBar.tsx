import { useStoreSettings } from "@/modules/settings/hooks/useSettings";

export function AnnouncementBar() {
  const { data } = useStoreSettings();
  const text =
    data?.announcement || "Free shipping on orders above ₹4,999 · Made from premium fabric";
  return (
    <div className="bg-navy text-center text-white">
      <p className="mx-auto max-w-7xl px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.28em] text-gold-light">
        {text}
      </p>
    </div>
  );
}
