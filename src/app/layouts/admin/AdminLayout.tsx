import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { PageLoader } from "@/shared/components/PageLoader";

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
