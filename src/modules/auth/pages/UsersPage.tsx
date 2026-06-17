import { useState } from "react";
import { Plus } from "lucide-react";
import { FormDialog } from "@/modules/common/FormDialog";
import { useUsers, useCreateUser, useUpdateUser } from "../hooks/useAdminAuth";
import { getApiErrorMessage } from "@/shared/api/http";
import { toast } from "@/shared/lib/toast";
import { formatDate, cn } from "@/lib/utils";
import type { AdminRole, AdminUser } from "../authSlice";

export function UsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" as AdminRole, phone: "" });
  const [err, setErr] = useState<string | null>(null);

  async function create() {
    setErr(null);
    try {
      await createUser.mutateAsync(form);
      toast.success("Staff user created");
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "staff", phone: "" });
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  }

  async function toggleActive(u: AdminUser) {
    try {
      await updateUser.mutateAsync({ id: u.id, payload: { isActive: !u.isActive } });
      toast.success(u.isActive ? "User disabled" : "User enabled");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  }

  return (
    <div className="aq-page space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Staff Users</h1>
          <p className="text-sm text-muted-foreground">Admin-panel accounts</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white">
          <Plus className="h-4 w-4" /> New User
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Loading…</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs", u.isActive ? "bg-emerald-500/15 text-emerald-600" : "bg-secondary text-muted-foreground")}>
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleActive(u)} className="rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-secondary">
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <FormDialog open={open} onOpenChange={setOpen} title="New Staff User" onSubmit={create} isPending={createUser.isPending} error={err}>
        <div className="space-y-3">
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} />
          <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} />
          <input placeholder="Temporary password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inp} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })} className={inp}>
            <option value="staff">Staff (fulfilment)</option>
            <option value="manager">Manager (catalog & orders)</option>
            <option value="admin">Administrator (full access)</option>
          </select>
        </div>
      </FormDialog>
    </div>
  );
}

const inp = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
