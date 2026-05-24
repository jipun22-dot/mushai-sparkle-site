import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, Workflow, Cpu, ShieldCheck, Layers, Activity } from "lucide-react";

const slides = [
  {
    icon: Eye,
    title: "See the unseen",
    body: "Every paper log, handwritten note, and shift book becomes structured, searchable data within seconds of capture.",
    metric: "12s",
    metricLabel: "Avg capture → digitized",
  },
  {
    icon: Workflow,
    title: "Stitch the workflow",
    body: "Mushai bridges your shop floor, ERP, LIMS, and HIS — no rip-and-replace, no IT war.",
    metric: "0",
    metricLabel: "Legacy systems replaced",
  },
  {
    icon: Cpu,
    title: "OCR that respects reality",
    body: "Trained on messy bedside slips, smudged log books, and torn permits — not glossy invoices.",
    metric: "98.6%",
    metricLabel: "Field-tested accuracy",
  },
  {
    icon: ShieldCheck,
    title: "Compliance, by default",
    body: "Audit trails, immutable logs, and role-scoped access ship the day you go live.",
    metric: "0",
    metricLabel: "Missed renewals on record",
  },
  {
    icon: Layers,
    title: "Composable, not monolithic",
    body: "Pick one sub-module, two, or the whole tower. Snap them together as the floor grows.",
    metric: "11",
    metricLabel: "Sub-modules to mix",
  },
  {
    icon: Activity,
    title: "Realtime, not overnight",
    body: "Streamed signals replace morning reports. Decisions move from 9 AM standups to the minute they happen.",
    metric: "<60s",
    metricLabel: "Floor → dashboard latency",
  },
];

export function SwipeableFeatures() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (n: number) => {
    setDir(n > i ? 1 : -1);
    setI((n + slides.length) % slides.length);
  };

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div className="max-w-xl">
            <div className="font-display text-xs tracking-[0.32em] text-primary">WHY MUSHAI WORKS</div>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Swipe through the operating thesis.</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => go(i - 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(i + 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative mt-12 h-[440px] md:h-[380px] overflow-hidden">
          <AnimatePresence custom={dir} initial={false} mode="popLayout">
            <motion.div
              key={i}
              custom={dir}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(i + 1);
                else if (info.offset.x > 80) go(i - 1);
              }}
              initial={{ opacity: 0, x: dir * 80, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -dir * 80, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 grid md:grid-cols-5 gap-6 cursor-grab active:cursor-grabbing"
            >
              <div className="md:col-span-3 rounded-[28px] bg-[oklch(0.13_0.006_270)] text-white p-10 relative overflow-hidden">
                <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl bg-primary/40" />
                <div className="relative">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary">
                    {(() => {
                      const Icon = slides[i].icon;
                      return <Icon className="h-6 w-6 text-white" />;
                    })()}
                  </div>
                  <h3 className="mt-8 font-display text-4xl md:text-5xl tracking-wide">{slides[i].title}</h3>
                  <p className="mt-5 max-w-lg text-white/65 text-lg leading-relaxed">{slides[i].body}</p>
                </div>
              </div>
              <div className="md:col-span-2 rounded-[28px] border border-border bg-card p-10 flex flex-col justify-between">
                <div>
                  <div className="font-display text-xs tracking-[0.32em] text-primary">PROOF</div>
                  <div className="mt-6 font-display text-7xl text-gradient-brand leading-none">{slides[i].metric}</div>
                  <div className="mt-3 text-sm text-muted-foreground">{slides[i].metricLabel}</div>
                </div>
                <div className="flex items-center gap-2">
                  {slides.map((_, j) => (
                    <button
                      key={j}
                      onClick={() => go(j)}
                      aria-label={`Go to slide ${j + 1}`}
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: j === i ? 32 : 8,
                        background: j === i ? "var(--primary)" : "color-mix(in oklab, var(--foreground) 18%, transparent)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
