import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Clock, ShieldAlert } from "lucide-react";

export function CostCalculator() {
  const [salary, setSalary] = useState([150000]); // monthly HOD salary (INR)
  const [clerical, setClerical] = useState([25]); // % of time on clerical
  const [headcount, setHeadcount] = useState([6]);
  const [auditFineRisk, setAuditFineRisk] = useState([500000]); // single fine cost
  const [retainer] = useState(135000); // monthly retainer

  const r = useMemo(() => {
    const monthlySavedPerHOD = salary[0] * (clerical[0] / 100);
    const monthlyTotal = monthlySavedPerHOD * headcount[0];
    const annualLabor = monthlyTotal * 12;
    const annualRisk = auditFineRisk[0]; // expected one mitigated fine/yr
    const annualRetainer = retainer * 12;
    const annualNet = annualLabor + annualRisk - annualRetainer;
    const payback = annualNet > 0 ? Math.max(1, Math.round((annualRetainer / (annualLabor + annualRisk)) * 12)) : 24;
    const multiplier = ((annualLabor + annualRisk) / annualRetainer).toFixed(1);
    return { monthlyTotal, annualLabor, annualRisk, annualRetainer, annualNet, payback, multiplier };
  }, [salary, clerical, headcount, auditFineRisk, retainer]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <section id="calculator" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">
          <div className="font-display text-xs tracking-[0.32em] text-primary">ROI CALCULATOR</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">See what disconnected systems cost you.</h2>
          <p className="mt-5 text-muted-foreground">Move the dials. We'll model the labor recovered, risk mitigated, and net annual impact — based on real Mushai customer baselines.</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-8 shadow-elegant">
            <Row label="Avg HOD monthly salary" value={fmt(salary[0])}>
              <Slider value={salary} onValueChange={setSalary} min={50000} max={500000} step={10000} />
            </Row>
            <Row label="% of HOD time lost to clerical work" value={`${clerical[0]}%`}>
              <Slider value={clerical} onValueChange={setClerical} min={5} max={60} step={1} />
            </Row>
            <Row label="HODs / managers affected" value={`${headcount[0]} people`}>
              <Slider value={headcount} onValueChange={setHeadcount} min={1} max={30} step={1} />
            </Row>
            <Row label="Average audit fine / non-compliance hit" value={fmt(auditFineRisk[0])}>
              <Slider value={auditFineRisk} onValueChange={setAuditFineRisk} min={100000} max={5000000} step={50000} />
            </Row>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Stat icon={Clock} tone="primary" label="Monthly labor recovered" value={fmt(r.monthlyTotal)} />
            <Stat icon={TrendingUp} tone="environ" label="Annual net impact" value={fmt(r.annualNet)} sub={`${r.multiplier}× the retainer cost`} />
            <Stat icon={ShieldAlert} tone="care" label="Payback period" value={`${r.payback} months`} sub={`Retainer ${fmt(retainer)}/mo`} />
            <motion.div
              key={r.annualNet}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground shadow-brand"
            >
              <div className="text-xs font-display tracking-[0.28em] opacity-80">RECOMMENDED</div>
              <div className="mt-2 text-2xl font-semibold">Nexus + Environ Retainer</div>
              <div className="mt-1 text-sm opacity-90">{fmt(retainer)}/month · onboarding ₹4,00,000</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-border last:border-b-0">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display text-base tracking-wider">{value}</div>
      </div>
      {children}
    </div>
  );
}

function Stat({
  icon: Icon, label, value, sub, tone,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string; tone: "primary" | "environ" | "care" }) {
  const bg = { primary: "var(--primary)", environ: "var(--environ)", care: "var(--care)" }[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ background: bg }}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      </div>
      <div className="mt-4 text-3xl font-semibold font-heading">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </motion.div>
  );
}
