import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Mushai Systems" },
      { name: "description", content: "Transparent setup + retainer pricing for Nexus, Environ, and Care modules." },
    ],
  }),
  component: Pricing,
});

const plans = [
  {
    name: "NEXUS", tag: "Manufacturing only",
    setup: "₹3,00,000", retainer: "₹95,000",
    features: ["Gate-Keep", "Floor-Pulse", "Lab-Link", "Work-Force", "Floor heatmap dashboard", "Email + Slack alerts"],
    accent: "var(--nexus)",
  },
  {
    name: "NEXUS + ENVIRON", tag: "Most popular", popular: true,
    setup: "₹4,00,000", retainer: "₹1,35,000",
    features: ["Everything in Nexus", "Permit-Check & Cert-Watch", "Log-Vision safety logs", "Eco-Audit carbon tracking", "Industrial heatmap dashboard", "Quarterly compliance review"],
    accent: "var(--nexus)",
  },
  {
    name: "CARE", tag: "Healthcare focused",
    setup: "₹3,50,000", retainer: "₹1,25,000",
    features: ["Nurse-Assist OCR", "Bridge-Bot ERP sync", "Vital-View early warning", "Claim-Guard reconciliation", "Ward heatmap dashboard", "On-site clinical liaison"],
    accent: "var(--care)",
  },
];

function Pricing() {
  return (
    <>
      <section className="relative pt-20 pb-12">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-5xl px-5 text-center"
        >
          <div className="font-display text-xs tracking-[0.32em] text-primary">PRICING MODEL</div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl tracking-tight">A retainer that pays for itself <span className="text-gradient-brand">five times over</span>.</h1>
          <p className="mt-5 text-muted-foreground max-w-2xl mx-auto">Indicative starting prices below — final scope is shaped to your sites, integrations and rollout pace. Talk to us for a tailored quote.</p>
        </motion.div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`relative rounded-3xl border bg-card p-8 ${p.popular ? "shadow-brand" : "border-border"}`}
              style={p.popular ? { borderColor: p.accent, boxShadow: `0 0 0 1px ${p.accent}, 0 24px 60px -30px ${p.accent}` } : undefined}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-display tracking-[0.28em] text-white" style={{ background: p.accent }}>MOST POPULAR</div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-2xl tracking-wider">{p.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{p.tag}</div>
                </div>
                <div className="h-10 w-10 rounded-2xl" style={{ background: p.accent }} />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl bg-surface-2 p-4">
                  <div className="text-[10px] font-display tracking-[0.28em] text-muted-foreground">SETUP</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground/80">Starts at</div>
                  <div className="mt-0.5 font-display text-2xl">{p.setup}</div>
                </div>
                <div className="rounded-2xl bg-surface-2 p-4">
                  <div className="text-[10px] font-display tracking-[0.28em] text-muted-foreground">RETAINER / MO</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground/80">Starts at</div>
                  <div className="mt-0.5 font-display text-2xl">{p.retainer}</div>
                </div>
              </div>
              <ul className="mt-7 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5"><Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/contact" className="mt-8 block">
                <Button className="w-full rounded-full text-white hover:opacity-90" style={{ background: p.accent }}>Explore <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto max-w-3xl px-5 mt-16 text-center">
          <p className="text-sm text-muted-foreground">Need a private module, on-prem deployment, or multi-site rollout? <Link to="/custom-build" className="text-primary underline underline-offset-4">Configure a custom build</Link>.</p>
        </div>
      </section>
    </>
  );
}
