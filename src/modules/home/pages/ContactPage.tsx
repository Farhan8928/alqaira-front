import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useStoreSettings } from "@/modules/settings/hooks/useSettings";
import { toast } from "@/shared/lib/toast";

export function ContactPage() {
  const { data: settings } = useStoreSettings();
  const [sent, setSent] = useState(false);

  return (
    <div className="aq-page mx-auto max-w-5xl px-4 py-14 md:px-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Get in touch</p>
        <h1 className="mt-2 font-display text-4xl text-foreground">Contact Us</h1>
        <p className="mt-2 text-sm text-muted-foreground">We'd love to hear from you.</p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <Info icon={Phone} label="Phone" value={settings?.supportPhone || "+971 50 123 4567"} />
          <Info icon={Mail} label="Email" value={settings?.supportEmail || "info@alqaira.com"} />
          <Info icon={MessageCircle} label="WhatsApp" value={settings?.whatsapp || "+971 50 123 4567"} />
          <Info icon={MapPin} label="Address" value={settings?.addressLine || "Dubai, United Arab Emirates"} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Thanks! We'll be in touch shortly.");
          }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          {sent ? (
            <p className="py-10 text-center text-sm text-success">Your message has been sent. Thank you!</p>
          ) : (
            <>
              <input placeholder="Your name" required className={inp} />
              <input placeholder="Email" type="email" required className={`${inp} mt-3`} />
              <textarea placeholder="Your message" rows={5} required className={`${inp} mt-3`} />
              <button type="submit" className="mt-4 w-full rounded-full bg-navy py-3 text-sm font-semibold text-white">
                Send Message
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

const inp = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
