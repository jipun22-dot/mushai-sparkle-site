import { motion } from "framer-motion";
import { ClipboardCheck, ScanLine, Database, Lightbulb, Rocket, TrendingUp } from "lucide-react";

const steps = [
  { icon: ClipboardCheck, title: "Discover",  desc: "We map your floors, paperwork and gaps in 1 workshop.",   tone: "var(--brand)" },
  { icon: ScanLine,        title: "Onboard",   desc: "Upload sample logs, charts and templates. We classify them.", tone: "var(--nexus)" },
  { icon: Database,        title: "Train",     desc: "Models learn your fields, codes and exceptions — privately.", tone: "var(--environ)" },
  { icon: Lightbulb,       title: "Pilot",     desc: "Live on one line, one zone or one ward in 4 weeks.",           tone: "var(--care)" },
  { icon: Rocket,          title: "Roll-out",  desc: "Scale across plants, sites and units with playbooks.",         tone: "var(--brand)" },
  { icon: TrendingUp,      title: "Results",   desc: "ROI dashboards, monthly review, retainer that pays 5×.",       tone: "var(--primary)" },
];

export function StepsSection() {
  return (
    <section className="py-24 border-y border-border bg-surface-2/40">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">
          <div className="font-display text-xs tracking-[0.32em] text-primary">FROM ONBOARDING TO RESULTS</div>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Six steps. <span className="text-muted-foreground">Eleven weeks.</span></h2>
          <p className="mt-4 text-muted-foreground">A repeatable path from first workshop to net-positive impact — without ripping out a single system you already run.</p>
        </div>

        <div className="relative mt-14">
          {/* connector line */}
          <div className="absolute left-0 right-0 top-7 hidden md:block h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-elegant"
                    style={{ background: s.tone }}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-3xl text-muted-foreground/40 tabular-nums">0{i + 1}</div>
                </div>
                <div className="mt-4 font-display text-base tracking-wider">{s.title.toUpperCase()}</div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
