import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ShieldAlert, FileSearch, Gauge } from "lucide-react";

type Signal = {
  id: string;
  label: string;
  zone: string;
  level: number; // 0-100
  tone: "ok" | "warn" | "alert";
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
};

const seed: Signal[] = [
  { id: "fp",  label: "Floor-Pulse · Line 2",   zone: "NEXUS",   level: 86, tone: "alert", icon: Activity },
  { id: "pc",  label: "Permit · Hot Work D-04", zone: "ENVIRON", level: 64, tone: "warn",  icon: ShieldAlert },
  { id: "mr",  label: "Shift report B · ICU",   zone: "CARE",    level: 42, tone: "ok",    icon: FileSearch },
  { id: "ar",  label: "Audit risk · Tank Farm", zone: "ENVIRON", level: 71, tone: "warn",  icon: Gauge },
];

const toneClass = {
  ok: "var(--environ)",
  warn: "oklch(0.78 0.16 75)",
  alert: "var(--primary)",
};

const tabs = ["LIVE", "TODAY", "WEEK"] as const;

export function ControlTower() {
  const [signals, setSignals] = useState<Signal[]>(seed);
  const [tab, setTab] = useState<(typeof tabs)[number]>("LIVE");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSignals((prev) =>
        prev.map((s) => {
          const delta = (Math.random() - 0.45) * 14;
          const level = Math.max(8, Math.min(98, Math.round(s.level + delta)));
          const tone: Signal["tone"] = level > 78 ? "alert" : level > 55 ? "warn" : "ok";
          return { ...s, level, tone };
        }),
      );
      setTick((t) => t + 1);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const total = signals.reduce((a, s) => a + s.level, 0);
  const avg = Math.round(total / signals.length);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="relative rounded-[2rem] border border-border bg-card/85 backdrop-blur p-6 md:p-7 shadow-elegant overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl bg-primary/30" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">CONTROL TOWER</div>
          <h3 className="mt-1.5 font-display text-xl">SHIFT B · {tab}</h3>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-background/60 p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[10px] font-display tracking-[0.2em] px-3 py-1.5 rounded-full transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-3">
        <Stat label="Signals" value={signals.length.toString()} />
        <Stat label="Avg load" value={`${avg}%`} pulse />
        <Stat label="Alerts" value={signals.filter((s) => s.tone === "alert").length.toString()} hot />
      </div>

      <div className="relative mt-5 space-y-2.5">
        <AnimatePresence initial={false}>
          {signals.map((s) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="rounded-xl border border-border bg-background/70 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-card border border-border">
                  <s.icon className="h-3.5 w-3.5" style={{ color: toneClass[s.tone] }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] truncate">{s.label}</div>
                    <div className="text-[10px] font-display tracking-widest" style={{ color: toneClass[s.tone] }}>
                      {s.level}%
                    </div>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      key={tick + s.id}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.level}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: toneClass[s.tone] }}
                    />
                  </div>
                </div>
                <div className="font-display text-[9px] tracking-[0.2em] text-muted-foreground">{s.zone}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative mt-5 grid grid-cols-12 gap-1">
        {Array.from({ length: 36 }).map((_, idx) => {
          const v = (Math.sin((idx + tick) * 0.7) * 0.5 + 0.5) * 0.85 + 0.1;
          return (
            <motion.div
              key={idx}
              animate={{ opacity: v }}
              transition={{ duration: 0.6 }}
              className="aspect-square rounded-sm"
              style={{ background: `color-mix(in oklab, var(--primary) ${Math.round(v * 100)}%, transparent)` }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

function Stat({ label, value, pulse, hot }: { label: string; value: string; pulse?: boolean; hot?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-3">
      <div className="flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${pulse ? "animate-pulse" : ""}`}
          style={{ background: hot ? "var(--primary)" : "var(--environ)" }}
        />
        <span className="text-[10px] font-display tracking-[0.2em] text-muted-foreground">{label}</span>
      </div>
      <div className="mt-1.5 font-display text-2xl">{value}</div>
    </div>
  );
}
