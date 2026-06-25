import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
  character: string;
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
            <div className="relative rounded-[2rem] border border-border bg-white p-0 shadow-elegant overflow-hidden">
              <div
                className="relative w-full aspect-square grid place-items-center overflow-hidden"
                style={{ background: `radial-gradient(circle at 50% 50%, color-mix(in oklab, ${accent} 18%, white) 0%, white 70%)` }}
              >
                {/* concentric halo behind the mascot */}
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="absolute rounded-full border"
                      style={{
                        borderColor: `color-mix(in oklab, ${accent} ${22 - i * 6}%, transparent)`,
                        width: `${55 + i * 18}%`, height: `${55 + i * 18}%`,
                      }} />
                  ))}
                </div>
                <img
                  src={props.character}
                  alt={`${props.name} module mascot`}
                  width={460} height={380} loading="lazy"
                  className="relative z-10 w-full h-full object-contain object-center drop-shadow-2xl"
                />
              </div>
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[10px] font-medium" style={{ color: accent }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} /> {props.slug.toUpperCase()} MODULE
              </div>
              <div className="relative p-5 border-t border-border bg-white text-neutral-900">
                <div className="font-display text-[10px] tracking-[0.32em]" style={{ color: accent }}>THE PITCH</div>
                <p className="mt-2 text-sm text-neutral-700">{props.pitch}</p>
              </div>
            </div>
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
