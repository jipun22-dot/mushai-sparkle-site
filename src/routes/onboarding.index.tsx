import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Factory, Leaf, HeartPulse, ArrowRight } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";

export const Route = createFileRoute("/onboarding/")({
  head: () => ({ meta: [{ title: "Onboarding — Mushai Systems" }] }),
  component: OnboardingIndex,
});

const mods = [
  { key: "nexus", name: "Nexus", icon: Factory, color: "var(--nexus)", desc: "Shift logs, production reports, downtime cards, QC sheets." },
  { key: "environ", name: "Environ", icon: Leaf, color: "var(--environ)", desc: "Permits-to-work, MSDS, EHS rounds, incident reports." },
  { key: "care", name: "Care", icon: HeartPulse, color: "var(--care)", desc: "Vitals charts, prescriptions, lab forms, discharge notes." },
] as const;

function OnboardingIndex() {
  return (
    <AuthGate title="Sign in to onboard documents">
      <section className="pt-12 pb-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="font-display text-xs tracking-[0.32em] text-primary">DOCUMENT ONBOARDING</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl tracking-tight">Train each module on your paperwork.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Upload your real templates so the module learns your exact forms — column orders, abbreviations, signatures and all.</p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {mods.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div key={m.key}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}>
                  <Link to="/onboarding/$module" params={{ module: m.key }} className="group block rounded-[28px] border border-border bg-card p-8 hover:shadow-elegant transition-shadow h-full">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: m.color }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-6 font-display text-2xl tracking-wider">{m.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
                    <div className="mt-6 inline-flex items-center gap-1.5 text-sm">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </AuthGate>
  );
}
