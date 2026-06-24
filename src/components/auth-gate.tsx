import { Link, useLocation } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";

export function AuthGate({ children, title = "Sign in to continue", description }: { children: React.ReactNode; title?: string; description?: string }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) {
    return (
      <section className="min-h-[60vh] grid place-items-center px-5 py-16">
        <div className="max-w-md text-center rounded-[28px] border border-border bg-card p-10 shadow-elegant">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Lock className="h-5 w-5" /></div>
          <h2 className="mt-5 font-display text-2xl tracking-wide">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {description ?? "Dashboards and onboarding are available to signed-in workspace members."}
          </p>
          <Link to="/auth" search={{ redirect: location.pathname }} className="mt-6 inline-block">
            <Button className="rounded-full bg-primary hover:bg-primary/90 shadow-brand">Sign in</Button>
          </Link>
        </div>
      </section>
    );
  }
  return <>{children}</>;
}
