import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";

export type ExpandableFeature = {
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  longDesc: string;
  bullets: string[];
  stat: { value: string; label: string };
};

export function ExpandableFeatures({
  accent,
  features,
  title = "Sub-modules",
  kicker = "BUILT FOR THE FLOOR",
}: {
  accent: string;
  features: ExpandableFeature[];
  title?: string;
  kicker?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">
          <div className="font-display text-xs tracking-[0.32em] text-primary">{kicker}</div>
          <h2 className="mt-3 text-4xl font-semibold">{title}</h2>
          <p className="mt-3 text-muted-foreground">Tap a card to expand. Each sub-module ships with its own data pipeline, mobile capture flow, and downstream connectors.</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {features.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.article
                key={f.name}
                layout
                initial={{ borderRadius: 28 }}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`group relative cursor-pointer overflow-hidden rounded-[28px] border bg-[oklch(0.13_0.006_270)] text-white p-7 md:p-8 transition-shadow ${
                  isOpen ? "md:col-span-2 shadow-elegant" : "hover:shadow-elegant"
                }`}
                style={{ borderColor: "color-mix(in oklab, white 8%, transparent)" }}
              >
                <motion.div
                  className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl"
                  animate={{ opacity: isOpen ? 0.55 : 0.18 }}
                  style={{ background: accent }}
                />
                <motion.div layout="position" className="relative flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: accent }}>
                      <f.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl md:text-3xl tracking-wider text-white/95">{f.name}</h3>
                      <p className="mt-2 text-sm md:text-[15px] text-white/55 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 20 }}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/80"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.div>
                </motion.div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="relative overflow-hidden"
                    >
                      <div className="mt-7 grid md:grid-cols-5 gap-6 pt-6 border-t border-white/10">
                        <div className="md:col-span-3">
                          <p className="text-white/75 text-[15px] leading-relaxed">{f.longDesc}</p>
                          <ul className="mt-5 grid sm:grid-cols-2 gap-2.5">
                            {f.bullets.map((b) => (
                              <li key={b} className="flex gap-2 text-sm text-white/65">
                                <span className="mt-2 h-1 w-1 rounded-full shrink-0" style={{ background: accent }} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:col-span-2">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <div className="font-display text-[10px] tracking-[0.32em] text-white/45">IMPACT</div>
                            <div className="mt-2 font-display text-4xl" style={{ color: accent }}>{f.stat.value}</div>
                            <div className="mt-1 text-xs text-white/55">{f.stat.label}</div>
                            <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-white/70">
                              See it in the dashboard <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
