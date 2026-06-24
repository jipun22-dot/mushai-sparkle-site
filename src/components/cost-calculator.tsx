import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Clock, ShieldAlert, Factory, Leaf, HeartPulse } from "lucide-react";

type ModuleKey = "nexus" | "environ" | "care";

type ModulePreset = {
  key: ModuleKey;
  name: string;
  icon: typeof Factory;
  color: string;
  retainer: number;
  recommendedLabel: string;
  riskLabel: string;
  riskMin: number; riskMax: number; riskStep: number; riskDefault: number;
  salaryLabel: string;
  salaryDefault: number;
  clericalDefault: number;
  headcountLabel: string;
  headcountDefault: number;
  headcountMax: number;
};

const presets: Record<ModuleKey, ModulePreset> = {
  nexus: {
    key: "nexus", name: "Nexus · Manufacturing", icon: Factory, color: "var(--nexus)",
    retainer: 135000,
    recommendedLabel: "Nexus Operations Retainer",
    riskLabel: "Cost of one production stoppage / quality recall",
    riskMin: 200000, riskMax: 8000000, riskStep: 100000, riskDefault: 1500000,
    salaryLabel: "Shift HOD / line manager monthly salary",
    salaryDefault: 140000,
    clericalDefault: 28,
    headcountLabel: "HODs / line managers affected",
    headcountDefault: 8, headcountMax: 40,
  },
  environ: {
    key: "environ", name: "Environ · EHS & Sustainability", icon: Leaf, color: "var(--environ)",
    retainer: 115000,
    recommendedLabel: "Environ Compliance Retainer",
    riskLabel: "Average regulatory fine / non-compliance hit",
    riskMin: 100000, riskMax: 10000000, riskStep: 100000, riskDefault: 2500000,
    salaryLabel: "EHS officer monthly salary",
    salaryDefault: 110000,
    clericalDefault: 35,
    headcountLabel: "EHS / safety officers affected",
    headcountDefault: 5, headcountMax: 30,
  },
  care: {
    key: "care", name: "Care · Healthcare Accuracy", icon: HeartPulse, color: "var(--care)",
    retainer: 165000,
    recommendedLabel: "Care Clinical Retainer",
    riskLabel: "Cost of a single charting / med-error event",
    riskMin: 200000, riskMax: 6000000, riskStep: 100000, riskDefault: 1200000,
    salaryLabel: "Senior nurse / charge nurse monthly salary",
    salaryDefault: 95000,
    clericalDefault: 32,
    headcountLabel: "Charge nurses / clinical leads affected",
    headcountDefault: 10, headcountMax: 60,
  },
};

export function CostCalculator() {
  const [moduleKey, setModuleKey] = useState<ModuleKey>("nexus");
  const preset = presets[moduleKey];

  const [salary, setSalary] = useState([preset.salaryDefault]);
  const [clerical, setClerical] = useState([preset.clericalDefault]);
  const [headcount, setHeadcount] = useState([preset.headcountDefault]);
  const [risk, setRisk] = useState([preset.riskDefault]);

  // Reset sliders when module changes
  function switchModule(k: ModuleKey) {
    const p = presets[k];
    setModuleKey(k);
    setSalary([p.salaryDefault]);
    setClerical([p.clericalDefault]);
    setHeadcount([p.headcountDefault]);
    setRisk([p.riskDefault]);
  }

  const r = useMemo(() => {
    const monthlySavedPerHOD = salary[0] * (clerical[0] / 100);
    const monthlyTotal = monthlySavedPerHOD * headcount[0];
    const annualLabor = monthlyTotal * 12;
    const annualRisk = risk[0];
    const annualRetainer = preset.retainer * 12;
    const annualNet = annualLabor + annualRisk - annualRetainer;
    const payback = annualNet > 0 ? Math.max(1, Math.round((annualRetainer / (annualLabor + annualRisk)) * 12)) : 24;
    const multiplier = ((annualLabor + annualRisk) / annualRetainer).toFixed(1);
    return { monthlyTotal, annualLabor, annualRisk, annualRetainer, annualNet, payback, multiplier };
  }, [salary, clerical, headcount, risk, preset.retainer]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <section id="calculator" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="font-display text-xs tracking-[0.32em] text-primary">ROI CALCULATOR</div>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">See what disconnected systems cost you.</h2>
            <p className="mt-5 text-muted-foreground">Pick a module, move the dials. We'll model the labor recovered, risk mitigated and net annual impact — based on real Mushai customer baselines.</p>
          </div>

          {/* Module toggle */}
          <div className="inline-flex p-1 rounded-full border border-border bg-card">
            {(Object.values(presets) as ModulePreset[]).map((m) => {
              const Icon = m.icon;
              const isActive = m.key === moduleKey;
              return (
                <button key={m.key} onClick={() => switchModule(m.key)}
                  className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? "text-white" : "text-muted-foreground hover:text-foreground"}`}>
                  {isActive && (
                    <motion.span layoutId="calc-pill" className="absolute inset-0 rounded-full" style={{ background: m.color }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                  )}
                  <Icon className="relative h-3.5 w-3.5" />
                  <span className="relative">{m.name.split(" · ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={moduleKey}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
            className="mt-14 grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-8 shadow-elegant">
              <div className="font-display text-[10px] tracking-[0.32em] mb-6" style={{ color: preset.color }}>{preset.name.toUpperCase()}</div>
              <Row label={preset.salaryLabel} value={fmt(salary[0])}>
                <Slider value={salary} onValueChange={setSalary} min={40000} max={500000} step={5000} />
              </Row>
              <Row label="% of time lost to clerical / paperwork" value={`${clerical[0]}%`}>
                <Slider value={clerical} onValueChange={setClerical} min={5} max={70} step={1} />
              </Row>
              <Row label={preset.headcountLabel} value={`${headcount[0]} people`}>
                <Slider value={headcount} onValueChange={setHeadcount} min={1} max={preset.headcountMax} step={1} />
              </Row>
              <Row label={preset.riskLabel} value={fmt(risk[0])}>
                <Slider value={risk} onValueChange={setRisk} min={preset.riskMin} max={preset.riskMax} step={preset.riskStep} />
              </Row>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <Stat icon={Clock} color="var(--primary)" label="Monthly labor recovered" value={fmt(r.monthlyTotal)} />
              <Stat icon={TrendingUp} color={preset.color} label="Annual net impact" value={fmt(r.annualNet)} sub={`${r.multiplier}× the retainer cost`} />
              <Stat icon={ShieldAlert} color="var(--brand)" label="Payback period" value={`${r.payback} months`} sub={`Retainer ${fmt(preset.retainer)}/mo`} />
              <motion.div key={r.annualNet}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6 text-white shadow-brand"
                style={{ background: `linear-gradient(135deg, ${preset.color}, color-mix(in oklab, ${preset.color} 60%, black))` }}
              >
                <div className="text-xs font-display tracking-[0.28em] opacity-80">RECOMMENDED</div>
                <div className="mt-2 text-2xl font-semibold">{preset.recommendedLabel}</div>
                <div className="mt-1 text-sm opacity-90">Starts at {fmt(preset.retainer)}/month · onboarding from ₹4,00,000</div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Row({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-border last:border-b-0">
      <div className="flex items-baseline justify-between mb-3 gap-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display text-base tracking-wider text-right">{value}</div>
      </div>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: color }}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      </div>
      <div className="mt-4 text-3xl font-semibold font-heading">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </motion.div>
  );
}
