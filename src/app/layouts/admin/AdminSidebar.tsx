import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { filterAdminSections } from "./menu";
import { Logo } from "@/shared/components/Logo";
import { useAppSelector } from "@/app/hooks";
import { cn } from "@/lib/utils";

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const role = useAppSelector((s) => s.adminAuth.user?.role);
  const sections = filterAdminSections(role);

  return (
    <>
      {open && <button aria-label="Close" onClick={onClose} className="fixed inset-0 z-30 bg-black/50 md:hidden" />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-sidebar text-sidebar-foreground transition-transform md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Logo tone="light" size={30} showTagline={false} />
          <button onClick={onClose} className="md:hidden" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {sections.map((section, i) => (
            <div key={section.heading ?? i} className="mb-4">
              {section.heading && (
                <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  {section.heading}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/admin"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-[11px] text-sidebar-foreground/40">
          ALQAIRA Admin · v1.0
        </div>
      </aside>
    </>
  );
}
