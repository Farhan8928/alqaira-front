import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useAccount";
import { useAppDispatch } from "@/app/hooks";
import { setCustomer } from "../accountSlice";
import { LogoMark } from "@/shared/components/Logo";
import { getApiErrorMessage } from "@/shared/api/http";

const schema = z.object({
  email: z.string().trim().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const login = useLogin();
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const from = (location.state as { from?: string } | null)?.from || "/account";

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const result = await login.mutateAsync(values);
      dispatch(setCustomer(result));
      navigate(from, { replace: true });
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <LogoMark size={48} />
      <h1 className="mt-5 font-display text-4xl text-foreground">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to your ALQAIRA account.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 w-full rounded-2xl border border-border bg-card p-7">
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <label className="mb-1.5 block text-sm font-medium">Email</label>
        <input {...form.register("email")} className={inputCls} placeholder="you@email.com" autoComplete="email" />
        {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}

        <label className="mb-1.5 mt-4 block text-sm font-medium">Password</label>
        <div className="relative">
          <input
            {...form.register("password")}
            type={show ? "text" : "password"}
            className={inputCls}
            autoComplete="current-password"
          />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {form.formState.errors.password && <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>}

        <button
          type="submit"
          disabled={login.isPending}
          className="mt-6 w-full rounded-full bg-navy py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {login.isPending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        New to ALQAIRA?{" "}
        <Link to="/register" className="font-semibold text-gold-dark">Create an account</Link>
      </p>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
