import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Factory, Leaf, HeartPulse, Zap, ShieldCheck, BarChart3, Workflow, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingTestimonials } from "@/components/floating-testimonials";
import { CostCalculator } from "@/components/cost-calculator";
import { LeadForm } from "@/components/lead-form";
import { ControlTower } from "@/components/control-tower";
import { SwipeableFeatures } from "@/components/swipeable-features";
import mascotTrio from "@/assets/mascots-trio.jpg";
import mascotNexus from "@/assets/mascot-nexus.jpg";
import mascotEnviron from "@/assets/mascot-environ.jpg";
import mascotCare from "@/assets/mascot-care.jpg";

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
  { slug: "nexus", to: "/nexus", icon: Factory, name: "NEXUS", mascot: mascotNexus, color: "var(--nexus)",
    tag: "Manufacturing Excellence",
    desc: "Digitize operations, boost productivity and ensure compliance on every shift." },
  { slug: "environ", to: "/environ", icon: Leaf, name: "ENVIRON", mascot: mascotEnviron, color: "var(--environ)",
    tag: "EHS & Sustainability",
    desc: "Track compliance, drive sustainability and protect what matters." },
  { slug: "care", to: "/care", icon: HeartPulse, name: "CARE", mascot: mascotCare, color: "var(--care)",
    tag: "Healthcare Accuracy",
    desc: "Improve accuracy, enhance outcomes and deliver better patient care." },
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
            {/* Big mascot card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="lg:col-span-7 relative rounded-[2rem] overflow-hidden bg-white border border-border shadow-elegant aspect-[16/11] lg:aspect-auto lg:min-h-[520px]"
            >
              <img src={mascotTrio} alt="Mushai mascots — Nexus, Environ and Care" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/85 to-transparent p-6 md:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="font-display text-[10px] tracking-[0.32em] text-neutral-500">THREE MODULES · ONE SYSTEM</div>
                    <h2 className="mt-2 font-display text-2xl md:text-3xl text-neutral-900">Integrated for manufacturing, EHS &amp; care.</h2>
                  </div>
                  <Link to="/nexus" className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 text-white px-4 py-2 text-xs font-medium hover:bg-neutral-700 transition-colors">
                    Explore modules <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
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

            {/* KPI strip — three small cards */}
            {[{ k: "5×", v: "Retainer ROI", d: "Pays for itself five times over." },
              { k: "11w", v: "Avg payback", d: "From pilot signature to net positive." },
              { k: "₹37.5K", v: "Saved / HOD / mo", d: "Reclaimed clerical hours." }].map((s, i) => (
              <motion.div key={s.v}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
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

      {/* OUR MODULES — bento service cards */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="font-display text-xs tracking-[0.32em] text-primary">OUR MODULES</div>
              <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Three modules.<br/><span className="text-muted-foreground">One intelligent system.</span></h2>
            </div>
            <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">View pricing <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {modules.map((m, i) => (
              <motion.div key={m.slug}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              >
                <Link to={m.to} className="group relative block h-full overflow-hidden rounded-[28px] border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-elegant">
                  <div className="relative aspect-[4/3] bg-white overflow-hidden border-b border-border">
                    <img src={m.mascot} alt={`${m.name} mascot`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-medium" style={{ color: m.color }}>
                      <m.icon className="h-3 w-3" /> {m.name}
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

      {/* CONTROL TOWER — Limitless possibilities */}
      <section className="py-24 border-y border-border bg-surface-2/40">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <h2 className="font-display text-4xl md:text-5xl tracking-tight uppercase leading-[1.05]">
              Limitless possibilities<br /><span className="text-muted-foreground">with Mushai.</span>
            </h2>
            <div className="mt-8 space-y-3">
              {["Innovation", "Technology", "Experience"].map((t) => (
                <div key={t} className="flex items-center justify-between border-b border-border pb-3 group cursor-default">
                  <span className="text-lg">{t}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground max-w-md">A live control tower that reads every signal across plant, site and ward — and surfaces only the ones worth acting on.</p>
          </div>
          <div className="lg:col-span-7">
            <ControlTower />
          </div>
        </div>
      </section>

      {/* WHY MUSHAI bento */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-2xl">
            <div className="font-display text-xs tracking-[0.32em] text-primary">WHY MUSHAI</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Built for the way<br />the floor actually works.</h2>
          </div>

          <div className="mt-12 grid grid-cols-6 gap-5 auto-rows-[180px]">
            <BentoCard className="col-span-6 md:col-span-3 row-span-2" tone="dark">
              <Sparkles className="h-5 w-5" />
              <div className="mt-auto">
                <div className="font-display text-2xl">Intelligent Automation</div>
                <p className="mt-2 text-sm opacity-70 max-w-sm">OCR + AI built for messy physical paper — handwritten logs, hourly charts, lab sheets. No more typing.</p>
              </div>
            </BentoCard>
            <BentoCard className="col-span-3 md:col-span-3" accent>
              <Zap className="h-5 w-5 text-primary" />
              <div className="mt-auto">
                <div className="font-medium">Real-time insights</div>
                <p className="mt-1 text-xs text-muted-foreground">Streamed signals, never overnight reports.</p>
              </div>
            </BentoCard>
            <BentoCard className="col-span-3 md:col-span-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div className="mt-auto">
                <div className="font-medium">Audit-ready</div>
                <p className="mt-1 text-xs text-muted-foreground">Governance built in from day one.</p>
              </div>
            </BentoCard>
            <BentoCard className="col-span-3 md:col-span-1 items-center text-center" stat>
              <div className="font-display text-3xl text-gradient-brand">94%</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Audit zones clear</div>
            </BentoCard>
            <BentoCard className="col-span-6 md:col-span-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div className="mt-auto">
                <div className="font-medium">Scalable Impact</div>
                <p className="mt-1 text-xs text-muted-foreground">One module, one floor — then everywhere.</p>
              </div>
            </BentoCard>
            <BentoCard className="col-span-6 md:col-span-3" tone="primary">
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

      {/* VOICES OF THE FUTURE */}
      <section className="py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-4xl md:text-5xl tracking-tight uppercase leading-[1.05]">
              Voices of<br /><span className="text-muted-foreground">the future.</span>
            </h2>
            <div className="mt-6 h-px bg-border" />
            <p className="mt-6 text-sm text-muted-foreground max-w-md">Operators, EHS leads and clinicians on what changed when Mushai went live on their floor.</p>
          </div>
          <div className="lg:col-span-7 space-y-4">
            {voices.map((v, i) => (
              <motion.div key={v.name}
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
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
        <div className="mx-auto max-w-3xl px-5">
          <LeadForm />
        </div>
      </section>
    </>
  );
}

function BentoCard({
  children, className = "", tone, accent, stat,
}: {
  children: React.ReactNode; className?: string; tone?: "dark" | "primary"; accent?: boolean; stat?: boolean;
}) {
  const toneCls =
    tone === "dark" ? "bg-[oklch(0.13_0.006_270)] text-white border-transparent"
    : tone === "primary" ? "text-primary-foreground border-transparent"
    : accent ? "bg-surface-2 border-border"
    : "bg-card border-border";
  return (
    <div
      className={`relative rounded-[24px] border p-6 flex flex-col overflow-hidden ${toneCls} ${className} ${stat ? "justify-center" : ""}`}
      style={tone === "primary" ? { background: "var(--gradient-brand)" } : undefined}
    >
      {tone === "dark" && (
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl opacity-40" style={{ background: "var(--brand)" }} />
      )}
      <div className="relative flex flex-col h-full">{children}</div>
    </div>
  );
}
