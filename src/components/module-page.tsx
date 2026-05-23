import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleDashboard } from "./dashboards/module-dashboard";
import type { HeatmapVariant } from "./dashboards/heatmap";
import { LeadForm } from "./lead-form";

export type Feature = { name: string; desc: string; icon: React.ComponentType<{ className?: string }> };

export type ModulePageProps = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: "nexus" | "environ" | "care";
  variant: HeatmapVariant;
  features: Feature[];
  kpis: { label: string; value: string; delta: string; tone: "up" | "down" | "warn" }[];
  trendName: string;
  trendData: { t: string; v: number }[];
  barName: string;
  barData: { t: string; v: number }[];
  events: { time: string; text: string; tone: "ok" | "warn" | "alert" }[];
  proof: { stat: string; label: string }[];
};

const accentVar = { nexus: "var(--nexus)", environ: "var(--environ)", care: "var(--care)" } as const;

export function ModulePage(props: ModulePageProps) {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" />
        <div
          className="absolute -top-32 right-0 h-[520px] w-[520px] rounded-full blur-3xl opacity-50 pointer-events-none"
          style={{ background: accentVar[props.accent] }}
        />
        <div className="relative mx-auto max-w-7xl px-5 grid lg:grid-cols-12 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="font-display text-xs tracking-[0.32em] text-primary uppercase">Module · {props.slug}</div>
            <h1 className="mt-5 font-display text-5xl md:text-7xl tracking-wide">{props.name}</h1>
            <p className="mt-4 text-xl md:text-2xl text-foreground/80">{props.tagline}</p>
            <p className="mt-6 max-w-xl text-muted-foreground">{props.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/contact"><Button size="lg" className="rounded-full bg-primary hover:bg-primary/90">Request walkthrough <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
              <a href="#features"><Button size="lg" variant="outline" className="rounded-full">See sub-modules</Button></a>
            </div>
          </motion.div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {props.proof.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="text-3xl font-semibold font-heading text-gradient-brand">{p.stat}</div>
                <div className="mt-1 text-xs text-muted-foreground">{p.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="font-display text-xs tracking-[0.32em] text-primary">SUB-MODULES</div>
              <h2 className="mt-3 text-4xl font-semibold">Built for the way the floor actually works.</h2>
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {props.features.map((f, i) => (
              <motion.article
                key={f.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:shadow-elegant hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-brand" style={{ background: accentVar[props.accent] }}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl tracking-wider">{f.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <ModuleDashboard
        variant={props.variant}
        kpis={props.kpis}
        trendName={props.trendName}
        trendData={props.trendData}
        barName={props.barName}
        barData={props.barData}
        events={props.events}
      />

      {/* CTA / LEAD */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-5 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="font-display text-xs tracking-[0.32em] text-primary">DEPLOY {props.slug.toUpperCase()}</div>
            <h2 className="mt-3 text-4xl font-semibold">Pilot in 4 weeks. Live in 8.</h2>
            <p className="mt-4 text-muted-foreground">Tell us the bottleneck. We'll model the recovery, scope a pilot, and quote a retainer that pays for itself five times over.</p>
          </div>
          <LeadForm compact />
        </div>
      </section>
    </>
  );
}
