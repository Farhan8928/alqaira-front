import { useNavigate } from "react-router-dom";
import { Menu, LogOut, ExternalLink } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearAdmin } from "@/modules/auth/authSlice";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  manager: "Manager",
  staff: "Staff",
};

export function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.adminAuth.user);

  const initials = (user?.name || "A")
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card px-4">
      <button onClick={onMenu} className="md:hidden" aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="font-display text-lg text-foreground">Admin Console</h1>
      <div className="flex-1" />
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary sm:flex"
      >
        <ExternalLink className="h-4 w-4" /> View Store
      </a>
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-gold">
          {initials}
        </span>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold leading-tight text-foreground">{user?.name}</p>
          <p className="text-[11px] text-muted-foreground">{user?.role ? ROLE_LABELS[user.role] : ""}</p>
        </div>
      </div>
      <button
        onClick={() => {
          dispatch(clearAdmin());
          navigate("/admin/login");
        }}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </header>
  );
}
