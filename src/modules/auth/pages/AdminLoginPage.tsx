import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin } from "../hooks/useAdminAuth";
import { useAppDispatch } from "@/app/hooks";
import { setAdmin } from "../authSlice";
import { Logo } from "@/shared/components/Logo";
import { getApiErrorMessage } from "@/shared/api/http";

const schema = z.object({
  email: z.string().trim().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export function AdminLoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const login = useAdminLogin();
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const result = await login.mutateAsync(values);
      dispatch(setAdmin(result));
      navigate("/admin", { replace: true });
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-12 text-white lg:flex">
        <Logo tone="light" size={40} />
        <div>
          <div className="aq-rule" />
          <h2 className="mt-5 max-w-md font-display text-4xl leading-tight">
            Run your ALQAIRA store with elegance.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Manage products, orders, customers, coupons and reviews — all in one premium console.
          </p>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} ALQAIRA · Admin Console</p>
      </div>

      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-2 text-gold-dark">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Staff Sign In</span>
          </div>
          <h1 className="font-display text-3xl text-foreground">Admin Console</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your store.</p>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input {...form.register("email")} className={inputCls} placeholder="admin@alqaira.com" autoComplete="email" />
              {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Password</label>
              <div className="relative">
                <input {...form.register("password")} type={show ? "text" : "password"} className={inputCls} autoComplete="current-password" />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.formState.errors.password && <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>}
            </div>
            <button type="submit" disabled={login.isPending} className="w-full rounded-lg bg-navy py-3 text-sm font-semibold text-white disabled:opacity-50">
              {login.isPending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
