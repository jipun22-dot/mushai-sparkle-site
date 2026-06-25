import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Factory, Leaf, HeartPulse, Upload, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthGate } from "@/components/auth-gate";
import { NexusDashboard } from "@/components/dashboards/nexus-dashboard";
import { EnvironDashboard } from "@/components/dashboards/environ-dashboard";
import { CareDashboard } from "@/components/dashboards/care-dashboard";
import { DocumentsInsights } from "@/components/dashboards/documents-insights";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Mushai Systems" }] }),
  component: DashboardPage,
});

type ModuleKey = "nexus" | "environ" | "care";
const modules: { key: ModuleKey; name: string; icon: typeof Factory; color: string }[] = [
  { key: "nexus", name: "Nexus", icon: Factory, color: "var(--nexus)" },
  { key: "environ", name: "Environ", icon: Leaf, color: "var(--environ)" },
  { key: "care", name: "Care", icon: HeartPulse, color: "var(--care)" },
];

function DashboardPage() {
  return (
    <AuthGate title="Sign in to view dashboards">
      <DashboardInner />
    </AuthGate>
  );
}

function DashboardInner() {
  const [active, setActive] = useState<ModuleKey>("nexus");
  const { user, signOut } = useAuth();

  return (
    <section className="relative pt-12 pb-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="font-display text-xs tracking-[0.32em] text-primary">CONTROL CENTER</div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl tracking-tight">Live module dashboards</h1>
            <p className="mt-2 text-sm text-muted-foreground">Signed in as {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/onboarding/$module" params={{ module: active }}>
              <Button variant="outline" className="rounded-full"><Upload className="h-4 w-4 mr-1.5" /> Onboarding</Button>
            </Link>
            <Button variant="outline" className="rounded-full" onClick={signOut}><LogOut className="h-4 w-4 mr-1.5" /> Sign out</Button>
          </div>
        </div>

        <div className="mt-8 inline-flex p-1 rounded-full border border-border bg-card">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = active === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActive(m.key)}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="dash-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: m.color }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="relative h-3.5 w-3.5" />
                <span className="relative">{m.name}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            {active === "nexus" && <NexusDashboard />}
            {active === "environ" && <EnvironDashboard />}
            {active === "care" && <CareDashboard />}
            <DocumentsInsights module={active} accent={modules.find((m) => m.key === active)!.color} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
