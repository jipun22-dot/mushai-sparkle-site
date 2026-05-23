import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Factory, Leaf, HeartPulse, Zap, ShieldCheck, BarChart3, Workflow, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingTestimonials } from "@/components/floating-testimonials";
import { CostCalculator } from "@/components/cost-calculator";
import { LeadForm } from "@/components/lead-form";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mushai Systems — Automate. Integrate. Elevate." },
      { name: "description", content: "Digitize the physical world. Nexus, Environ, Care — three modules, one intelligent advantage." },
    ],
  }),
  component: Home,
});

const modules = [
  {
    slug: "nexus", to: "/nexus", icon: Factory,
    name: "NEXUS", color: "var(--nexus)",
    tag: "For Manufacturing Excellence",
    bullets: ["Digitize shop floor in real time", "Boost productivity & efficiency", "Manage workforce & compliance"],
  },
  {
    slug: "environ", to: "/environ", icon: Leaf,
    name: "ENVIRON", color: "var(--environ)",
    tag: "For EHS & Sustainability",
    bullets: ["Ensure safety & health compliance", "Track permits, audits, certifications", "Monitor sustainability & carbon"],
  },
  {
    slug: "care", to: "/care", icon: HeartPulse,
    name: "CARE", color: "var(--care)",
    tag: "For Healthcare Accuracy",
    bullets: ["Digitize clinical data & records", "Improve accuracy & decisions", "Audit-ready compliance"],
  },
] as const;

const advantages = [
  { icon: Sparkles, name: "Intelligent Automation", desc: "Eliminate manual work — OCR + AI built for messy physical paper." },
  { icon: Zap, name: "Real-time Insights", desc: "Act faster, decide better. Streamed signals, never overnight reports." },
  { icon: ShieldCheck, name: "Trust & Compliance", desc: "Built-in security and governance. Audit-ready from day one." },
  { icon: BarChart3, name: "Scalable Impact", desc: "Grow with confidence. One module, one floor, then everywhere." },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute bottom-0 left-0 right-0 h-40 wave-lines opacity-60" />
        <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3.5 py-1.5 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-display tracking-[0.28em]">AUTOMATE · INTEGRATE · ELEVATE</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
              className="mt-6 font-display text-5xl md:text-7xl leading-[1.05] tracking-tight"
            >
              Your factory is <br />
              <span className="text-gradient-brand">losing time.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground"
            >
              Not because people are slow. Because systems are <span className="text-primary font-medium">disconnected</span>.
              Mushai stitches every paper log, every shift, every floor into one intelligent surface.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link to="/contact"><Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 shadow-brand">Book a demo<ArrowRight className="ml-1.5 h-4 w-4" /></Button></Link>
              <a href="#calculator"><Button size="lg" variant="outline" className="rounded-full">Calculate ROI</Button></a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-10 grid grid-cols-3 max-w-md gap-6"
            >
              {[{ k: "5×", v: "Retainer ROI" }, { k: "11w", v: "Avg payback" }, { k: "₹60K", v: "Saved / mo" }].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-2xl md:text-3xl text-gradient-brand">{s.k}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="lg:col-span-5 relative">
            <HeroPanel />
          </div>
        </div>
      </section>

      {/* HIDDEN DELAYS */}
      <section className="py-24 border-y border-border bg-surface-2/40">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-display text-xs tracking-[0.32em] text-primary">EVERY SHIFT</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Hidden delays compound.</h2>
            <p className="mt-5 text-muted-foreground max-w-lg">Daily operational delays come from the same four cracks — manual reporting, late approvals, paper tracking, zero real-time visibility. The cost compounds every shift.</p>
            <div className="mt-9 space-y-4">
              {[
                ["Manual reporting", "Time-consuming and error-prone."],
                ["Delayed approvals", "Bottlenecks slow everything down."],
                ["Paper-based tracking", "Hard to track. Hard to trust."],
                ["No real-time visibility", "Reactive, not proactive decisions."],
              ].map(([k, v], i) => (
                <motion.div key={k} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 border-l-2 border-primary/40 pl-4">
                  <div>
                    <div className="font-medium">{k}</div>
                    <div className="text-sm text-muted-foreground">{v}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <DelayPanel />
        </div>
      </section>

      {/* MODULES */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <div className="font-display text-xs tracking-[0.32em] text-primary">THREE MODULES · ONE ADVANTAGE</div>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Smarter operations. Safer workplaces. Better outcomes.</h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {modules.map((m, i) => (
              <motion.div key={m.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={m.to} className="group relative block h-full overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-2 hover:shadow-elegant">
                  <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-30 transition-opacity group-hover:opacity-60" style={{ background: m.color }} />
                  <div className="relative">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl text-white shadow-brand" style={{ background: m.color }}>
                      <m.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 font-display text-3xl tracking-wider">{m.name}</h3>
                    <div className="mt-1 text-sm text-muted-foreground">{m.tag}</div>
                    <ul className="mt-6 space-y-2.5 text-sm">
                      {m.bullets.map((b) => (
                        <li key={b} className="flex gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />{b}</li>
                      ))}
                    </ul>
                    <div className="mt-8 inline-flex items-center gap-1.5 text-sm text-primary">Explore {m.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {advantages.map((a, i) => (
              <motion.div key={a.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card/60 p-6">
                <a.icon className="h-5 w-5 text-primary" />
                <div className="mt-4 font-medium">{a.name}</div>
                <div className="mt-1.5 text-sm text-muted-foreground">{a.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM BUILD STRIP */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-display text-xs tracking-[0.32em] text-primary">CUSTOM BUILD</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold">A module shaped to your floor.</h2>
            <p className="mt-5 max-w-lg text-muted-foreground">Mushai's three modules are starting points, not endpoints. Tell us your unique workflow and we'll compose a private build that fits your industry's quirks.</p>
            <Link to="/custom-build" className="mt-7 inline-flex"><Button size="lg" className="rounded-full bg-primary">Configure a build <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
          </div>
          <div className="relative rounded-3xl border border-border bg-card p-8 shadow-elegant">
            <div className="grid grid-cols-2 gap-3">
              {[Factory, Leaf, HeartPulse, Workflow, ShieldCheck, BarChart3].map((Icon, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="aspect-square rounded-2xl border border-border bg-surface-2 grid place-items-center">
                  <Icon className="h-6 w-6 text-primary" />
                </motion.div>
              ))}
            </div>
            <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
          </div>
        </div>
      </section>

      <CostCalculator />
      <FloatingTestimonials />

      {/* LEAD */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-3xl px-5">
          <LeadForm />
        </div>
      </section>
    </>
  );
}

function HeroPanel() {
  const items = [
    { label: "DOWNTIME ALERT", v: 86, c: "var(--primary)" },
    { label: "PRODUCTION DELAY", v: 64, c: "var(--primary)" },
    { label: "MANUAL REPORTING", v: 42, c: "var(--primary)" },
    { label: "AUDIT RISK", v: 71, c: "var(--primary)" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
      className="relative aspect-[5/6] rounded-[2rem] border border-border bg-card/80 backdrop-blur p-7 shadow-elegant overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">CONTROL TOWER</div>
          <h3 className="mt-1.5 font-display text-xl">SHIFT B · LIVE</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> 12 signals
        </div>
      </div>
      <div className="relative mt-7 space-y-3">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12 }}
            className="rounded-xl border border-border bg-background/60 p-3.5"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-display tracking-[0.2em] text-muted-foreground">{it.label}</span>
              <span className="text-primary font-medium">{it.v}%</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${it.v}%` }} transition={{ delay: 0.7 + i * 0.12, duration: 1, ease: "easeOut" }}
                className="h-full rounded-full" style={{ background: it.c }} />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="relative mt-6 grid grid-cols-3 gap-2">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 + i * 0.03 }}
            className="aspect-square rounded-md"
            style={{ background: `color-mix(in oklab, var(--primary) ${(Math.sin(i) * 0.5 + 0.5) * 80 + 10}%, transparent)` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function DelayPanel() {
  const tiles = [
    { label: "APPROVALS PENDING", v: 12 },
    { label: "REPORTS DELAYED", v: 8 },
    { label: "DATA DISCONNECTED", v: 5 },
    { label: "VISIBILITY GAPS", v: 9 },
  ];
  return (
    <div className="relative aspect-square max-w-md mx-auto">
      <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full border border-primary/30 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-xs tracking-[0.32em] text-muted-foreground">DELAY</div>
          <div className="mt-1 font-display text-2xl text-primary">EVERY SHIFT</div>
        </div>
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring" />
      </div>
      {tiles.map((t, i) => {
        const positions = [
          "top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0",
        ];
        return (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className={`absolute ${positions[i]} w-44 rounded-2xl border border-border bg-card p-4`}
          >
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-display tracking-[0.2em] text-muted-foreground">{t.label}</span>
              <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] grid place-items-center">{t.v}</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-muted">
              <div className="h-1 rounded-full bg-primary" style={{ width: `${50 + i * 12}%` }} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
