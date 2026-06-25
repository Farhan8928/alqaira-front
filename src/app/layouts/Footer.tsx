import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/shared/components/Logo";
import { useStoreSettings } from "@/modules/settings/hooks/useSettings";

export function Footer() {
  const { data: settings } = useStoreSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-navy text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <Logo tone="light" size={64} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {settings?.tagline || "Premium Thobes, Jubbas & Abayas"} — good-quality clothing in
            premium fabric for the whole family, delivered across India.
          </p>
          <div className="mt-5 flex gap-3">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-white/20 p-2 hover:border-gold hover:text-gold"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-full border border-white/20 p-2 hover:border-gold hover:text-gold"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <FooterCol title="Shop">
          <FooterLink to="/shop?section=men">Men</FooterLink>
          <FooterLink to="/shop?section=women">Women</FooterLink>
          <FooterLink to="/shop?section=kids">Kids &amp; Boys</FooterLink>
          <FooterLink to="/shop">All Products</FooterLink>
        </FooterCol>

        <FooterCol title="Help">
          <FooterLink to="/track">Track Order</FooterLink>
          <FooterLink to="/account">My Account</FooterLink>
          <FooterLink to="/about">About Us</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
        </FooterCol>

        <FooterCol title="Get in touch">
          {settings?.supportPhone && (
            <span className="flex items-center gap-2 text-sm text-white/60">
              <Phone className="h-4 w-4 text-gold" /> {settings.supportPhone}
            </span>
          )}
          {settings?.supportEmail && (
            <span className="flex items-center gap-2 text-sm text-white/60">
              <Mail className="h-4 w-4 text-gold" /> {settings.supportEmail}
            </span>
          )}
          {settings?.addressLine && (
            <span className="flex items-center gap-2 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-gold" /> {settings.addressLine}
            </span>
          )}
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 md:flex-row md:px-6">
          <p>
            © {year} {settings?.storeName || "ALQAIRA"}. All rights reserved.
          </p>
          <p>Made with care · Secure payments · Cash on Delivery available</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-light">
        {title}
      </h4>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-sm text-white/60 transition-colors hover:text-gold">
      {children}
    </Link>
  );
}
