import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../hooks/useAccount";
import { useAppDispatch } from "@/app/hooks";
import { setCustomer } from "../accountSlice";
import { LogoMark } from "@/shared/components/Logo";
import { getApiErrorMessage } from "@/shared/api/http";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "At least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const register = useRegister();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const result = await register.mutateAsync(values);
      dispatch(setCustomer(result));
      navigate("/account", { replace: true });
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <LogoMark size={48} />
      <h1 className="mt-5 font-display text-4xl text-foreground">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Join ALQAIRA for faster checkout & order tracking.
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 w-full rounded-2xl border border-border bg-card p-7"
      >
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <FormField label="Full Name" error={form.formState.errors.name?.message}>
          <input {...form.register("name")} className={inputCls} />
        </FormField>
        <FormField label="Email" error={form.formState.errors.email?.message}>
          <input {...form.register("email")} className={inputCls} autoComplete="email" />
        </FormField>
        <FormField label="Phone (optional)">
          <input {...form.register("phone")} className={inputCls} />
        </FormField>
        <FormField label="Password" error={form.formState.errors.password?.message}>
          <input
            {...form.register("password")}
            type="password"
            className={inputCls}
            autoComplete="new-password"
          />
        </FormField>

        <button
          type="submit"
          disabled={register.isPending}
          className="mt-6 w-full rounded-full bg-navy py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {register.isPending ? "Creating…" : "Create Account"}
        </button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-gold-dark">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 first:mt-0">
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
