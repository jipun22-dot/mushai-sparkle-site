import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

type AuthSearch = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): AuthSearch => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in — Mushai Systems" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const { user } = useAuth();

  useEffect(() => {
    if (user) nav({ to: redirect || "/dashboard" });
  }, [user, redirect, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: fullName, company },
          },
        });
        if (error) throw error;
        toast.success("Account created");
      }
      nav({ to: redirect || "/dashboard" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-140px)] grid place-items-center px-5 py-16">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(50%_50%_at_50%_30%,black,transparent)]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-[28px] border border-border bg-card p-8 shadow-elegant"
      >
        <div className="font-display text-xs tracking-[0.32em] text-primary">{mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}</div>
        <h1 className="mt-3 font-display text-3xl tracking-wide">{mode === "signin" ? "Welcome back." : "Get started."}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" ? "Access your live module dashboards and onboarding hub." : "Spin up a demo workspace in seconds."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1.5" />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1.5" />
          </div>
          <Button type="submit" disabled={busy} className="w-full rounded-full bg-primary hover:bg-primary/90 shadow-brand">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>{mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="ml-1 h-4 w-4" /></>)}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>New here? <button type="button" className="text-foreground underline underline-offset-4" onClick={() => setMode("signup")}>Create account</button></>
          ) : (
            <>Already have an account? <button type="button" className="text-foreground underline underline-offset-4" onClick={() => setMode("signin")}>Sign in</button></>
          )}
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
        </div>
      </motion.div>
    </section>
  );
}
