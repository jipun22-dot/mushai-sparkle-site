import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Clock, ShieldAlert, Factory, Leaf, HeartPulse, Sparkles, ArrowUpRight } from "lucide-react";
import { useCurrency, formatMoney, CurrencySwitch, type Currency } from "@/lib/currency";

type ModuleKey = "nexus" | "environ" | "care";

// All baselines stored in INR; converted per-currency at display time.
type ModulePreset = {
  key: ModuleKey;
  name: string;
  icon: typeof Factory;
  color: string;
  retainerINR: number;
  recommendedLabel: string;
  riskLabel: string;
  riskMinINR: number; riskMaxINR: number; riskDefaultINR: number;
  salaryLabel: string;
  salaryDefaultINR: number;
  salaryMinINR: number; salaryMaxINR: number;
  clericalDefault: number;
  headcountLabel: string;
  headcountDefault: number;
  headcountMax: number;
};

const presets: Record<ModuleKey, ModulePreset> = {
  nexus: {
    key: "nexus", name: "Nexus · Manufacturing", icon: Factory, color: "var(--nexus)",
    retainerINR: 135000,
    recommendedLabel: "Nexus Operations Retainer",
    riskLabel: "Cost of one production stoppage / quality recall",
    riskMinINR: 200000, riskMaxINR: 8000000, riskDefaultINR: 1500000,
    salaryLabel: "Shift HOD / line manager monthly salary",
    salaryDefaultINR: 140000, salaryMinINR: 40000, salaryMaxINR: 500000,
    clericalDefault: 28,
    headcountLabel: "HODs / line managers affected",
    headcountDefault: 8, headcountMax: 40,
  },
  environ: {
    key: "environ", name: "Environ · EHS & Sustainability", icon: Leaf, color: "var(--environ)",
    retainerINR: 115000,
    recommendedLabel: "Environ Compliance Retainer",
    riskLabel: "Average regulatory fine / non-compliance hit",
    riskMinINR: 100000, riskMaxINR: 10000000, riskDefaultINR: 2500000,
    salaryLabel: "EHS officer monthly salary",
    salaryDefaultINR: 110000, salaryMinINR: 40000, salaryMaxINR: 400000,
    clericalDefault: 35,
    headcountLabel: "EHS / safety officers affected",
    headcountDefault: 5, headcountMax: 30,
  },
  care: {
    key: "care", name: "Care · Healthcare Accuracy", icon: HeartPulse, color: "var(--care)",
    retainerINR: 165000,
    recommendedLabel: "Care Clinical Retainer",
    riskLabel: "Cost of a single charting / med-error event",
    riskMinINR: 200000, riskMaxINR: 6000000, riskDefaultINR: 1200000,
    salaryLabel: "Senior nurse / charge nurse monthly salary",
    salaryDefaultINR: 95000, salaryMinINR: 30000, salaryMaxINR: 400000,
    clericalDefault: 32,
    headcountLabel: "Charge nurses / clinical leads affected",
    headcountDefault: 10, headcountMax: 60,
  },
};

// Conversion + locally-tuned step. Not a strict FX — these are localized package economics.
const fx: Record<Currency, { rate: number; step: number; riskStep: number }> = {
  INR: { rate: 1, step: 5000, riskStep: 100000 },
  USD: { rate: 0.012, step: 100, riskStep: 1000 },
  AED: { rate: 0.044, step: 250, riskStep: 5000 },
};

function conv(amountINR: number, c: Currency) {
  const v = amountINR * fx[c].rate;
  if (c === "INR") return Math.round(v / 1000) * 1000;
  return Math.round(v / 50) * 50;
}

export function CostCalculator() {
  const { currency } = useCurrency();
  const [moduleKey, setModuleKey] = useState<ModuleKey>("nexus");
  const preset = presets[moduleKey];

  const [salary, setSalary] = useState([preset.salaryDefaultINR]);
  const [clerical, setClerical] = useState([preset.clericalDefault]);
  const [headcount, setHeadcount] = useState([preset.headcountDefault]);
  const [risk, setRisk] = useState([preset.riskDefaultINR]);

  function switchModule(k: ModuleKey) {
    const p = presets[k];
    setModuleKey(k);
    setSalary([p.salaryDefaultINR]);
    setClerical([p.clericalDefault]);
    setHeadcount([p.headcountDefault]);
    setRisk([p.riskDefaultINR]);
  }

  const r = useMemo(() => {
    const monthlySavedPerHOD = salary[0] * (clerical[0] / 100);
    const monthlyTotal = monthlySavedPerHOD * headcount[0];
    const annualLabor = monthlyTotal * 12;
    const annualRisk = risk[0];
    const annualRetainer = preset.retainerINR * 12;
    const annualNet = annualLabor + annualRisk - annualRetainer;
    const payback = annualNet > 0 ? Math.max(1, Math.round((annualRetainer / (annualLabor + annualRisk)) * 12)) : 24;
    const multiplier = (annualLabor + annualRisk) / annualRetainer;
    const fiveYr = annualNet * 5;
    return { monthlyTotal, annualLabor, annualRisk, annualRetainer, annualNet, payback, multiplier, fiveYr };
  }, [salary, clerical, headcount, risk, preset.retainerINR]);

  const f = (n: number) => formatMoney(conv(n, currency), currency);

  // Slider min/max in CURRENT currency units
  const salaryMin = conv(preset.salaryMinINR, currency);
  const salaryMax = conv(preset.salaryMaxINR, currency);
  const riskMin = conv(preset.riskMinINR, currency);
  const riskMax = conv(preset.riskMaxINR, currency);
  const salaryStep = fx[currency].step;
  const riskStep = fx[currency].riskStep;
  // Convert slider value <-> INR baseline so calc stays consistent
  const salaryDisp = conv(salary[0], currency);
  const riskDisp = conv(risk[0], currency);

  return (
    <section id="calculator" className="relative py-28">
      <div className="absolute inset-0 -z-10 bg-grid opacity-20 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="font-display text-xs tracking-[0.32em] text-primary inline-flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> ROI CALCULATOR · LIVE
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">See what disconnected systems <span className="text-gradient-brand">really</span> cost you.</h2>
            <p className="mt-5 text-muted-foreground">Pick a module, move the dials. We'll model the labor recovered, risk mitigated and net annual impact — based on real Mushai customer baselines.</p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <CurrencySwitch />
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
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={moduleKey + currency}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}
            className="mt-14 grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-8 shadow-elegant">
              <div className="font-display text-[10px] tracking-[0.32em] mb-6" style={{ color: preset.color }}>{preset.name.toUpperCase()} · {currency}</div>
              <Row label={preset.salaryLabel} value={f(salary[0])}>
                <Slider
                  value={[salaryDisp]}
                  onValueChange={(v) => setSalary([Math.round(v[0] / fx[currency].rate)])}
                  min={salaryMin} max={salaryMax} step={salaryStep}
                />
              </Row>
              <Row label="% of time lost to clerical / paperwork" value={`${clerical[0]}%`}>
                <Slider value={clerical} onValueChange={setClerical} min={5} max={70} step={1} />
              </Row>
              <Row label={preset.headcountLabel} value={`${headcount[0]} people`}>
                <Slider value={headcount} onValueChange={setHeadcount} min={1} max={preset.headcountMax} step={1} />
              </Row>
              <Row label={preset.riskLabel} value={f(risk[0])}>
                <Slider
                  value={[riskDisp]}
                  onValueChange={(v) => setRisk([Math.round(v[0] / fx[currency].rate)])}
                  min={riskMin} max={riskMax} step={riskStep}
                />
              </Row>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {/* Hero result */}
              <motion.div key={r.annualNet + currency}
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-3xl p-7 text-white shadow-brand"
                style={{ background: `linear-gradient(135deg, ${preset.color}, color-mix(in oklab, ${preset.color} 55%, black))` }}
              >
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                <div className="relative">
                  <div className="text-[10px] font-display tracking-[0.32em] opacity-80">ANNUAL NET IMPACT</div>
                  <motion.div
                    key={r.annualNet}
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="mt-2 font-display text-4xl md:text-5xl tabular-nums leading-none"
                  >
                    {f(r.annualNet)}
                  </motion.div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px]">
                    <ArrowUpRight className="h-3 w-3" /> {r.multiplier.toFixed(1)}× the retainer cost · 5-yr {f(r.fiveYr)}
                  </div>
                  {/* visual bar */}
                  <div className="mt-5 space-y-2">
                    <BarRow label="Labor recovered" value={r.annualLabor} max={r.annualLabor + r.annualRisk} display={f(r.annualLabor)} />
                    <BarRow label="Risk mitigated" value={r.annualRisk} max={r.annualLabor + r.annualRisk} display={f(r.annualRisk)} />
                    <BarRow label="Retainer cost" value={r.annualRetainer} max={r.annualLabor + r.annualRisk} display={`− ${f(r.annualRetainer)}`} muted />
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                <Stat icon={Clock} color="var(--primary)" label="Monthly labor recovered" value={f(r.monthlyTotal)} />
                <Stat icon={ShieldAlert} color="var(--brand)" label="Payback" value={`${r.payback} mo`} />
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
                {preset.recommendedLabel} · starts at <span className="font-display text-foreground">{f(preset.retainerINR)}/mo</span> · onboarding from {f(400000)}.
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function BarRow({ label, value, max, display, muted }: { label: string; value: number; max: number; display: string; muted?: boolean }) {
  const pct = max > 0 ? Math.min(100, Math.max(2, (value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] opacity-90">
        <span>{label}</span><span className="tabular-nums">{display}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
          className="h-full rounded-full"
          style={{ background: muted ? "rgba(255,255,255,0.35)" : "white" }}
        />
      </div>
    </div>
  );
}

function Row({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-border last:border-b-0">
      <div className="flex items-baseline justify-between mb-3 gap-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display text-base tracking-wider text-right tabular-nums">{value}</div>
      </div>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ background: color }}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground leading-tight">{label}</div>
      </div>
      <div className="mt-3 text-2xl font-semibold font-heading tabular-nums">{value}</div>
    </motion.div>
  );
}

// Used by other pages (e.g. pricing) if needed in future.
export { TrendingUp };
