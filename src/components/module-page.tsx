import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Activity, Radio, Gauge, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableFeatures, type ExpandableFeature } from "./expandable-features";
import { LeadForm } from "./lead-form";

export type ModulePageProps = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: "nexus" | "environ" | "care";
  features: ExpandableFeature[];
  proof: { stat: string; label: string }[];
  /** Optional — kept for backwards compatibility; no longer rendered. */
  character?: string;
  pitch: string;
  dashboard: React.ReactNode;
};

const accentVar = { nexus: "var(--nexus)", environ: "var(--environ)", care: "var(--care)" } as const;

export function ModulePage(props: ModulePageProps) {
  const accent = accentVar[props.accent];
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute -top-32 right-0 h-[520px] w-[520px] rounded-full blur-3xl opacity-40 pointer-events-none" style={{ background: accent }} />
        <div className="relative mx-auto max-w-7xl px-5 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="lg:col-span-7">
            <div className="font-display text-xs tracking-[0.32em] text-primary uppercase">Module · {props.slug}</div>
            <h1 className="mt-5 font-display text-5xl md:text-7xl tracking-wide">{props.name}</h1>
            <p className="mt-4 text-xl md:text-2xl text-foreground/80">{props.tagline}</p>
            <p className="mt-6 max-w-xl text-muted-foreground">{props.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/contact"><Button size="lg" className="rounded-full bg-primary hover:bg-primary/90">Request walkthrough <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
              <a href="#features"><Button size="lg" variant="outline" className="rounded-full">See sub-modules</Button></a>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {props.proof.map((p, i) => (
                <motion.div key={p.label}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
                  className="rounded-2xl border border-border bg-card p-4">
                  <div className="text-2xl font-semibold font-heading text-gradient-brand">{p.stat}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{p.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-5 relative">
            <ModuleHeroVisual accent={accent} slug={props.slug} pitch={props.pitch} />
          </motion.div>
        </div>
      </section>

      {/* EXPANDABLE FEATURES */}
      <ExpandableFeatures accent={accent} features={props.features} title="Built for the way the floor actually works." kicker={`SUB-MODULES · ${props.slug.toUpperCase()}`} />

      {/* DASHBOARD */}
      {props.dashboard}

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

function ModuleHeroVisual({ accent, slug, pitch }: { accent: string; slug: string; pitch: string }) {
  return (
    <div className="relative rounded-[2rem] border border-border overflow-hidden shadow-elegant bg-[oklch(0.13_0.006_270)] text-white">
      {/* glow */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-50" style={{ background: accent }} />
      <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />

      <div className="relative aspect-square p-6 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-[10px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: accent }} /> {slug.toUpperCase()} · LIVE
          </div>
          <div className="text-[10px] font-display tracking-[0.28em] opacity-60">MODULE</div>
        </div>

        {/* Orbiting rings */}
        <div className="relative flex-1 grid place-items-center">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                borderColor: `color-mix(in oklab, ${accent} ${28 - i * 6}%, transparent)`,
                width: `${40 + i * 18}%`, aspectRatio: "1 / 1",
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 18 + i * 6, ease: "linear", repeat: Infinity }}
            >
              <div
                className="absolute h-2 w-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ background: accent, top: i % 2 === 0 ? 0 : "100%", left: i % 2 === 0 ? "50%" : "50%" }}
              />
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
            className="relative grid h-24 w-24 place-items-center rounded-2xl backdrop-blur-md"
            style={{ background: `color-mix(in oklab, ${accent} 25%, transparent)`, boxShadow: `0 0 60px -5px ${accent}` }}
          >
            <span className="font-display text-2xl tracking-[0.2em]">{slug.slice(0, 2).toUpperCase()}</span>
          </motion.div>
        </div>

        {/* Live mini-metrics */}
        <div className="relative grid grid-cols-3 gap-2">
          {[
            { icon: Activity, k: "Signals", v: "1.2k/s" },
            { icon: Gauge,    k: "Load",    v: "62%" },
            { icon: Radio,    k: "Nodes",   v: "184" },
          ].map((m, i) => (
            <motion.div key={m.k}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-2.5"
            >
              <div className="flex items-center gap-1.5 text-[9px] opacity-70"><m.icon className="h-3 w-3" />{m.k.toUpperCase()}</div>
              <div className="mt-1 font-display text-sm tabular-nums" style={{ color: accent }}>{m.v}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative p-5 border-t border-white/10 bg-black/30">
        <div className="font-display text-[10px] tracking-[0.32em] inline-flex items-center gap-1.5" style={{ color: accent }}>
          <Cpu className="h-3 w-3" /> THE PITCH
        </div>
        <p className="mt-2 text-sm opacity-85">{pitch}</p>
      </div>
    </div>
  );
}
