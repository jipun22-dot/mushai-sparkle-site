import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Factory, Leaf, HeartPulse, Zap, ShieldCheck, BarChart3, Workflow, Sparkles, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingTestimonials } from "@/components/floating-testimonials";
import { CostCalculator } from "@/components/cost-calculator";
import { LeadForm } from "@/components/lead-form";
import { ControlTower } from "@/components/control-tower";
import { SwipeableFeatures } from "@/components/swipeable-features";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mushai Systems — Automate. Integrate. Elevate." },
      { name: "description", content: "Three modules, one intelligent system. Nexus for manufacturing, Environ for EHS, Care for healthcare." },
    ],
  }),
  component: Home,
});

const modules = [
  { slug: "nexus", to: "/nexus", icon: Factory, name: "NEXUS", color: "var(--nexus)",
    tag: "Manufacturing Excellence",
    desc: "Digitize operations, boost productivity and ensure compliance on every shift.",
    metrics: [{ k: "OEE", v: "+18%" }, { k: "Lines", v: "12 live" }, { k: "Faults", v: "−42%" }] },
  { slug: "environ", to: "/environ", icon: Leaf, name: "ENVIRON", color: "var(--environ)",
    tag: "EHS & Sustainability",
    desc: "Track compliance, drive sustainability and protect what matters.",
    metrics: [{ k: "Permits", v: "184" }, { k: "Zones", v: "7 safe" }, { k: "CO₂", v: "−6.4%" }] },
  { slug: "care", to: "/care", icon: HeartPulse, name: "CARE", color: "var(--care)",
    tag: "Healthcare Accuracy",
    desc: "Improve accuracy, enhance outcomes and deliver better patient care.",
    metrics: [{ k: "Charts", v: "1,284" }, { k: "EWS", v: "−41%" }, { k: "Beds", v: "32" }] },
] as const;

const voices = [
  { name: "Operations Director · Auto Tier-1", quote: "Mushai unified four paper logs into a single shift report. Our morning meeting is now data, not opinion." },
  { name: "EHS Head · Specialty Chemicals", quote: "Permit tracking that used to live in a binder is finally live. Audit prep went from weeks to a single afternoon." },
  { name: "CMO · 220-bed Hospital", quote: "Care reads handwritten observations faster than our junior staff transcribes them — and never misses a critical value." },
];

function Home() {
  return (
    <>
      {/* HERO — bento style */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-24">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Big animated control card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="lg:col-span-7 relative rounded-[2rem] overflow-hidden border border-border shadow-elegant min-h-[420px] lg:min-h-[520px] bg-[oklch(0.13_0.006_270)] text-white"
            >
              <HeroLivePanel />
            </motion.div>

            {/* Headline card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.05 }}
              className="lg:col-span-5 relative rounded-[2rem] border border-border bg-card p-8 md:p-10 flex flex-col justify-between min-h-[420px] overflow-hidden"
            >
              <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full blur-3xl opacity-50" style={{ background: "var(--brand)" }} />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1.5 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-display tracking-[0.28em]">AUTOMATE · INTEGRATE · ELEVATE</span>
                </div>
                <h1 className="mt-6 font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
                  Digitize the<br />
                  <span className="text-gradient-brand">physical world.</span>
                </h1>
                <p className="mt-5 text-sm md:text-base text-muted-foreground max-w-md">
                  Mushai stitches every paper log, every shift, every floor into one intelligent surface. Real-time, audit-ready, ROI-positive in eleven weeks.
                </p>
              </div>
              <div className="relative mt-8 flex flex-wrap gap-3">
                <Link to="/contact"><Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 shadow-brand">Book a demo <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
                <a href="#calculator"><Button size="lg" variant="outline" className="rounded-full">Calculate ROI</Button></a>
              </div>
            </motion.div>

            {/* KPI strip */}
            {[{ k: "5×", v: "Retainer ROI", d: "Pays for itself five times over." },
              { k: "11w", v: "Avg payback", d: "From pilot signature to net positive." },
              { k: "₹37.5K", v: "Saved / HOD / mo", d: "Reclaimed clerical hours." }].map((s, i) => (
              <motion.div key={s.v}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                whileHover={{ y: -4 }}
                className="lg:col-span-4 rounded-2xl border border-border bg-card p-6 flex items-center gap-5"
              >
                <div className="font-display text-3xl md:text-4xl text-gradient-brand shrink-0">{s.k}</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
                  <div className="mt-0.5 text-sm">{s.d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR MODULES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="font-display text-xs tracking-[0.32em] text-primary">OUR MODULES</div>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Three modules.<br/><span className="text-muted-foreground">One intelligent system.</span></h2>
            </motion.div>
            <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">View pricing <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {modules.map((m, i) => (
              <motion.div key={m.slug}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <Link to={m.to} className="group relative block h-full overflow-hidden rounded-[28px] border border-border bg-card transition-shadow hover:shadow-elegant">
                  {/* Animated header instead of mascot */}
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-border" style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${m.color} 14%, var(--card)) 0%, var(--card) 80%)` }}>
                    <ModuleArt color={m.color} icon={m.icon} />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-card/85 backdrop-blur px-3 py-1 text-[10px] font-medium border border-border" style={{ color: m.color }}>
                      <m.icon className="h-3 w-3" /> {m.name}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
                      {m.metrics.map((mt) => (
                        <div key={mt.k} className="rounded-xl bg-card/85 backdrop-blur border border-border px-2 py-1.5">
                          <div className="text-[8px] font-display tracking-[0.2em] text-muted-foreground">{mt.k}</div>
                          <div className="text-xs font-display tabular-nums" style={{ color: m.color }}>{mt.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-7">
                    <div className="font-display text-[10px] tracking-[0.32em]" style={{ color: m.color }}>{m.tag.toUpperCase()}</div>
                    <h3 className="mt-2 font-display text-2xl tracking-wider">{m.name}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{m.desc}</p>
                    <div className="mt-6 inline-flex items-center gap-1.5 text-sm">
                      Learn more <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROL TOWER */}
      <section className="py-24 border-y border-border bg-surface-2/40">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="lg:col-span-5">
            <h2 className="font-display text-4xl md:text-5xl tracking-tight uppercase leading-[1.05]">
              Limitless possibilities<br /><span className="text-muted-foreground">with Mushai.</span>
            </h2>
            <div className="mt-8 space-y-3">
              {["Innovation", "Technology", "Experience"].map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-center justify-between border-b border-border pb-3 group cursor-default"
                >
                  <span className="text-lg">{t}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground max-w-md">A live control tower that reads every signal across plant, site and ward — and surfaces only the ones worth acting on.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="lg:col-span-7">
            <ControlTower />
          </motion.div>
        </div>
      </section>

      {/* WHY MUSHAI bento */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl">
            <div className="font-display text-xs tracking-[0.32em] text-primary">WHY MUSHAI</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Built for the way<br />the floor actually works.</h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-6 gap-5 auto-rows-[180px]">
            <BentoCard className="col-span-6 md:col-span-3 row-span-2" tone="dark" delay={0}>
              <Sparkles className="h-5 w-5" />
              <div className="mt-auto">
                <div className="font-display text-2xl">Intelligent Automation</div>
                <p className="mt-2 text-sm opacity-70 max-w-sm">OCR + AI built for messy physical paper — handwritten logs, hourly charts, lab sheets. No more typing.</p>
              </div>
            </BentoCard>
            <BentoCard className="col-span-3 md:col-span-3" accent delay={0.05}>
              <Zap className="h-5 w-5 text-primary" />
              <div className="mt-auto">
                <div className="font-medium">Real-time insights</div>
                <p className="mt-1 text-xs text-muted-foreground">Streamed signals, never overnight reports.</p>
              </div>
            </BentoCard>
            <BentoCard className="col-span-3 md:col-span-2" delay={0.1}>
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div className="mt-auto">
                <div className="font-medium">Audit-ready</div>
                <p className="mt-1 text-xs text-muted-foreground">Governance built in from day one.</p>
              </div>
            </BentoCard>
            <BentoCard className="col-span-3 md:col-span-1 items-center text-center" stat delay={0.15}>
              <div className="font-display text-3xl text-gradient-brand">94%</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Audit zones clear</div>
            </BentoCard>
            <BentoCard className="col-span-6 md:col-span-3" delay={0.2}>
              <BarChart3 className="h-5 w-5 text-primary" />
              <div className="mt-auto">
                <div className="font-medium">Scalable Impact</div>
                <p className="mt-1 text-xs text-muted-foreground">One module, one floor — then everywhere.</p>
              </div>
            </BentoCard>
            <BentoCard className="col-span-6 md:col-span-3" tone="primary" delay={0.25}>
              <Workflow className="h-5 w-5" />
              <div className="mt-auto">
                <div className="font-display text-xl">Custom builds</div>
                <p className="mt-1 text-xs opacity-80">Modules shaped to your workflow.</p>
                <Link to="/custom-build" className="mt-3 inline-flex items-center gap-1 text-xs font-medium">Configure <ArrowRight className="h-3 w-3" /></Link>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      <SwipeableFeatures />

      {/* VOICES */}
      <section className="py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-12 gap-12">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5">
            <h2 className="font-display text-4xl md:text-5xl tracking-tight uppercase leading-[1.05]">
              Voices of<br /><span className="text-muted-foreground">the future.</span>
            </h2>
            <div className="mt-6 h-px bg-border" />
            <p className="mt-6 text-sm text-muted-foreground max-w-md">Operators, EHS leads and clinicians on what changed when Mushai went live on their floor.</p>
          </motion.div>
          <div className="lg:col-span-7 space-y-4">
            {voices.map((v, i) => (
              <motion.div key={v.name}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5"
              >
                <div className="flex-1">
                  <p className="text-sm">{v.quote}</p>
                  <div className="mt-3 text-xs font-medium text-muted-foreground">{v.name}</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/40 shrink-0 grid place-items-center text-white text-sm font-medium">
                  {v.name.charAt(0)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CostCalculator />
      <FloatingTestimonials />

      <section id="contact" className="py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl px-5">
          <LeadForm />
        </motion.div>
      </section>
    </>
  );
}

function BentoCard({
  children, className = "", tone, accent, stat, delay = 0,
}: {
  children: React.ReactNode; className?: string; tone?: "dark" | "primary"; accent?: boolean; stat?: boolean; delay?: number;
}) {
  const toneCls =
    tone === "dark" ? "bg-[oklch(0.13_0.006_270)] text-white border-transparent"
    : tone === "primary" ? "text-primary-foreground border-transparent"
    : accent ? "bg-surface-2 border-border"
    : "bg-card border-border";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={`relative rounded-[24px] border p-6 flex flex-col overflow-hidden ${toneCls} ${className} ${stat ? "justify-center" : ""}`}
      style={tone === "primary" ? { background: "var(--gradient-brand)" } : undefined}
    >
      {tone === "dark" && (
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl opacity-40" style={{ background: "var(--brand)" }} />
      )}
      <div className="relative flex flex-col h-full">{children}</div>
    </motion.div>
  );
}

/* -------- Decorative animated panel for each module card -------- */
function ModuleArt({ color, icon: Icon }: { color: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="absolute inset-0">
      {/* concentric rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{
            borderColor: `color-mix(in oklab, ${color} ${30 - i * 8}%, transparent)`,
            width: 140 + i * 70,
            height: 140 + i * 70,
            marginLeft: -(70 + i * 35),
            marginTop: -(70 + i * 35),
          }}
          animate={{ rotate: i % 2 ? -360 : 360 }}
          transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* grid texture */}
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(50%_60%_at_50%_50%,black,transparent)]" />
      {/* central icon */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center h-20 w-20 rounded-3xl shadow-elegant"
        style={{ background: `color-mix(in oklab, ${color} 18%, var(--card))`, border: `1px solid color-mix(in oklab, ${color} 40%, transparent)` }}
      >
        <Icon className="h-9 w-9" />
      </motion.div>
      {/* pulse dot */}
      <motion.span
        className="absolute h-2 w-2 rounded-full"
        style={{ background: color, top: "22%", left: "78%" }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <motion.span
        className="absolute h-1.5 w-1.5 rounded-full"
        style={{ background: color, top: "72%", left: "18%" }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 0.6 }}
      />
    </div>
  );
}

/* -------- Live control panel for the hero (replaces big mascot card) -------- */
function HeroLivePanel() {
  const channels = [
    { name: "Floor-Pulse · Nexus", color: "var(--nexus)", value: 86, label: "OEE" },
    { name: "Permit-Check · Environ", color: "var(--environ)", value: 94, label: "ZONES" },
    { name: "Vital-View · Care", color: "var(--care)", value: 41, label: "EWS DROP" },
  ];
  return (
    <>
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(60%_70%_at_70%_30%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40" style={{ background: "var(--brand)" }} />
      <div className="relative h-full p-6 md:p-8 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1.5 text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-display tracking-[0.28em]">LIVE · CONTROL TOWER</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[10px] tracking-[0.22em] text-white/60 font-display">
            <Activity className="h-3 w-3" /> 3 MODULES · STREAMING
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {channels.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
              className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="font-display text-[9px] tracking-[0.22em] text-white/60">{c.name.toUpperCase()}</div>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="font-display text-3xl tabular-nums">{c.value}<span className="text-base text-white/50">%</span></div>
                <div className="text-[10px] tracking-widest text-white/50">{c.label}</div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${c.value}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                  className="h-full rounded-full" style={{ background: c.color }}
                />
                <motion.div
                  className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ["-50%", "400%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sparkline strip */}
        <div className="mt-6 grid gap-3 md:grid-cols-2 flex-1">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 relative overflow-hidden"
          >
            <div className="font-display text-[9px] tracking-[0.22em] text-white/60">SIGNAL HEALTH · LAST 12 MIN</div>
            <Sparkline />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4"
          >
            <div className="font-display text-[9px] tracking-[0.22em] text-white/60">EVENTS ROUTED</div>
            <div className="mt-2 font-display text-3xl tabular-nums">12,481</div>
            <div className="mt-1 text-[10px] text-white/50">+318 in the last hour</div>
            <div className="mt-3 flex items-center gap-3">
              {modules.map((m) => (
                <div key={m.slug} className="flex items-center gap-1.5 text-[10px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
                  {m.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="font-display text-[10px] tracking-[0.28em] text-white/50">THREE MODULES · ONE SYSTEM</div>
          <Link to="/nexus" className="inline-flex items-center gap-1.5 rounded-full bg-white text-neutral-900 px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors">
            Explore modules <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

function Sparkline() {
  // procedural points
  const pts = Array.from({ length: 32 }).map((_, i) => {
    const y = 50 + Math.sin(i * 0.5) * 14 + Math.cos(i * 0.21) * 8;
    return `${(i / 31) * 100},${y}`;
  });
  const path = "M " + pts.join(" L ");
  return (
    <div className="mt-3 relative h-[110px]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.65 0.25 27)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.65 0.25 27)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={path}
          fill="none"
          stroke="oklch(0.78 0.22 27)"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        <path d={path + " L 100,100 L 0,100 Z"} fill="url(#hg)" />
      </svg>
    </div>
  );
}
