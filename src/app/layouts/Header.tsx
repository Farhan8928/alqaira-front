import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/shared/components/Logo";
import { useAppSelector } from "@/app/hooks";
import { selectCartCount } from "@/modules/cart/cartSlice";
import { useCategories } from "@/modules/category/hooks/useCategories";
import { cn } from "@/lib/utils";
import type { Section } from "@/modules/product/types";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "men", label: "Men" },
  { key: "women", label: "Women" },
  { key: "kids", label: "Kids" },
];

export function Header() {
  const navigate = useNavigate();
  const cartCount = useAppSelector((s) => selectCartCount(s.cart.items));
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length);
  const customer = useAppSelector((s) => s.customerAuth.customer);
  const { data: categories = [] } = useCategories();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [openSection, setOpenSection] = useState<Section | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!term.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(term.trim())}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setTerm("");
  }

  const catsBySection = (s: Section) => categories.filter((c) => c.section === s);

  return (
    <header className="sticky top-0 z-40 aq-glass">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 md:px-6">
        <button className="md:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Menu className="h-6 w-6 text-foreground" />
        </button>

        <Link to="/" className="shrink-0 transition-opacity hover:opacity-90">
          <Logo size={52} />
        </Link>

        <nav className="ml-8 hidden flex-1 items-center gap-8 md:flex">
          {SECTIONS.map((s) => {
            const cats = catsBySection(s.key);
            return (
              <div
                key={s.key}
                className="group relative"
                onMouseEnter={() => setOpenSection(s.key)}
                onMouseLeave={() => setOpenSection(null)}
              >
                <NavLink
                  to={`/shop?section=${s.key}`}
                  className={({ isActive }) =>
                    cn("nav-link flex items-center gap-1 py-2 uppercase", isActive && "text-foreground")
                  }
                >
                  {s.label}
                  {cats.length > 0 && <ChevronDown className="h-3.5 w-3.5" />}
                </NavLink>
                {cats.length > 0 && openSection === s.key && (
                  <div className="absolute left-0 top-full z-50 w-64 animate-fade-in rounded-xl border border-border bg-card p-2 shadow-2xl">
                    {cats.map((c) => (
                      <Link
                        key={c.id}
                        to={`/shop?section=${s.key}&category=${c.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <NavLink to="/track" className="nav-link py-2 uppercase">
            Track Order
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 md:gap-3">
          <button aria-label="Search" onClick={() => setSearchOpen((o) => !o)} className="p-2">
            <Search className="h-5 w-5 text-foreground" />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="relative p-2">
            <Heart className="h-5 w-5 text-foreground" />
            {wishlistCount > 0 && <Badge>{wishlistCount}</Badge>}
          </Link>
          <Link to={customer ? "/account" : "/login"} aria-label="Account" className="p-2">
            <User className="h-5 w-5 text-foreground" />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative p-2">
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-background">
          <form
            onSubmit={submitSearch}
            className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search thobes, kurtas, abayas…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col overflow-y-auto bg-background p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo size={30} />
              <button onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form
              onSubmit={submitSearch}
              className="mb-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </form>
            {SECTIONS.map((s) => (
              <div key={s.key} className="border-b border-border py-3">
                <Link
                  to={`/shop?section=${s.key}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-wide text-foreground"
                >
                  {s.label}
                </Link>
                <div className="mt-2 space-y-1 pl-3">
                  {catsBySection(s.key).map((c) => (
                    <Link
                      key={c.id}
                      to={`/shop?section=${s.key}&category=${c.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1 text-sm text-muted-foreground"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link to="/track" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-medium">
              Track Order
            </Link>
            <Link
              to={customer ? "/account" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="py-3 text-sm font-medium"
            >
              {customer ? "My Account" : "Sign in / Register"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy">
      {children}
    </span>
  );
}
