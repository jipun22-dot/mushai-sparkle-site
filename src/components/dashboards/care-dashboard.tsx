import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, ClipboardPlus, HeartPulse, ShieldAlert, Thermometer, Wind } from "lucide-react";
import { DashboardHeader, Kpi, ChartCard } from "./nexus-dashboard";
import { LiveTicker, ActionQueue } from "./dashboard-extras";

type BedStatus = "stable" | "watch" | "critical" | "empty";
type Bed = {
  id: string;
  ward: "ICU" | "ER" | "Ortho" | "Cardio";
  bay: number;
  status: BedStatus;
  patient: string;
  hr: number;
  spo2: number;
  temp: number;
  ews: number; // early warning score
  note: string;
};

function makeBeds(): Bed[] {
  const wards: Bed["ward"][] = ["ICU", "ER", "Ortho", "Cardio"];
  const arr: Bed[] = [];
  let n = 1;
  wards.forEach((w) => {
    for (let b = 1; b <= 8; b++) {
      const r = Math.random();
      const status: BedStatus = r < 0.08 ? "critical" : r < 0.25 ? "watch" : r < 0.85 ? "stable" : "empty";
      arr.push({
        id: `${w}-${b}`,
        ward: w,
        bay: b,
        status,
        patient: status === "empty" ? "—" : `P-${(1000 + n).toString()}`,
        hr: 60 + Math.round(Math.random() * 50),
        spo2: 89 + Math.round(Math.random() * 10),
        temp: 36.4 + Math.random() * 2,
        ews: status === "critical" ? 7 + Math.round(Math.random() * 3) : status === "watch" ? 4 + Math.round(Math.random() * 2) : Math.round(Math.random() * 3),
        note:
          status === "critical" ? "Tachycardia trend · senior pinged" :
          status === "watch" ? "Vitals drifting · re-check in 15m" :
          status === "empty" ? "Bed open" : "Vitals stable",
      });
      n++;
    }
  });
  return arr;
}

const statusColor: Record<BedStatus, string> = {
  stable:   "var(--environ)",
  watch:    "oklch(0.78 0.16 75)",
  critical: "var(--primary)",
  empty:    "color-mix(in oklab, var(--muted-foreground) 30%, transparent)",
};

export function CareDashboard() {
  const [beds, setBeds] = useState<Bed[]>(makeBeds);
  const [activeId, setActiveId] = useState(beds[0].id);
  const [ward, setWard] = useState<"ALL" | Bed["ward"]>("ALL");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setBeds((prev) =>
        prev.map((b) => {
          if (b.status === "empty") return b;
          const hr = Math.max(48, Math.min(140, b.hr + Math.round((Math.random() - 0.5) * 6)));
          const spo2 = Math.max(82, Math.min(100, b.spo2 + Math.round((Math.random() - 0.5) * 2)));
          const ews = (hr > 110 ? 3 : hr > 95 ? 1 : 0) + (spo2 < 92 ? 3 : spo2 < 95 ? 1 : 0) + Math.round(Math.random());
          const status: BedStatus = ews >= 6 ? "critical" : ews >= 3 ? "watch" : "stable";
          return { ...b, hr, spo2, ews, status };
        }),
      );
      setTick((t) => t + 1);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => ward === "ALL" ? beds : beds.filter((b) => b.ward === ward), [beds, ward]);
  const active = beds.find((b) => b.id === activeId) ?? beds[0];
  const occupied = beds.filter((b) => b.status !== "empty").length;
  const critical = beds.filter((b) => b.status === "critical").length;
  const watching = beds.filter((b) => b.status === "watch").length;

  const vitals = useMemo(
    () => Array.from({ length: 14 }).map((_, i) => ({
      t: `${i}m`,
      hr: Math.max(55, Math.min(135, active.hr + Math.round(Math.sin((i + tick) * 0.6) * 8 + (Math.random() - 0.5) * 4))),
      spo2: Math.max(85, Math.min(100, active.spo2 + Math.round(Math.sin((i + tick) * 0.4) * 2))),
    })),
    [active, tick],
  );

  const claim = [
    { t: "ICU", v: 142 }, { t: "Ortho", v: 88 }, { t: "Cardio", v: 119 }, { t: "ER", v: 96 },
  ];

  return (
    <section className="relative py-20 bg-surface-2/40">
      <div className="mx-auto max-w-7xl px-5">
        <DashboardHeader kicker="CARE · WARD CONTROL" title="Every bed, every vital — one surface." shift={"B"} onShift={() => {}} />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={HeartPulse}    label="Beds occupied"   value={`${occupied}/${beds.length}`} delta={`${Math.round(occupied/beds.length*100)}% util`} tone="up" />
          <Kpi icon={ShieldAlert}   label="Critical now"    value={critical.toString()} delta={critical ? "escalate" : "all stable"} tone={critical ? "warn" : "up"} />
          <Kpi icon={Activity}      label="Early warnings"  value={watching.toString()} delta="re-check 15m" tone="warn" />
          <Kpi icon={ClipboardPlus} label="Charts auto-entered" value="1,284" delta="+312 today" tone="up" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          {/* WARD GRID */}
          <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">VITAL-VIEW</div>
                <h3 className="mt-1.5 text-lg font-semibold">Ward bays · live vitals</h3>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-border bg-surface-2 p-1">
                {(["ALL","ICU","ER","Ortho","Cardio"] as const).map((w) => (
                  <button key={w} onClick={() => setWard(w)}
                    className={`text-[10px] font-display tracking-[0.18em] px-2.5 py-1.5 rounded-full transition-colors ${
                      ward === w ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}>{w}</button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-8 gap-2">
              {filtered.map((b) => {
                const isActive = b.id === activeId;
                return (
                  <motion.button
                    key={b.id}
                    onClick={() => setActiveId(b.id)}
                    initial={false}
                    animate={{ scale: isActive ? 1.06 : 1 }}
                    className={`relative aspect-square rounded-xl border p-1.5 text-left ${isActive ? "ring-2 ring-primary" : ""}`}
                    style={{
                      background: `color-mix(in oklab, ${statusColor[b.status]} ${b.status === "empty" ? 8 : 22}%, var(--card))`,
                      borderColor: `color-mix(in oklab, ${statusColor[b.status]} 40%, transparent)`,
                    }}
                  >
                    <div className="font-display text-[8px] tracking-[0.2em] text-muted-foreground">{b.ward}-{b.bay}</div>
                    {b.status !== "empty" && (
                      <>
                        <div className="mt-0.5 font-display text-[10px] tabular-nums">{b.hr}</div>
                        <div className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: statusColor[b.status] }} />
                      </>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center gap-4 text-[10px] text-muted-foreground">
              {(["stable","watch","critical","empty"] as BedStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: statusColor[s] }} />{s}</div>
              ))}
            </div>
          </div>

          {/* PATIENT DETAIL */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">PATIENT DETAIL</div>
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: statusColor[active.status] }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={active.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <h3 className="mt-2 text-2xl font-semibold">{active.patient}</h3>
                <div className="mt-1 text-xs text-muted-foreground">{active.ward} · Bay {active.bay} · EWS <span className="font-display" style={{ color: statusColor[active.status] }}>{active.ews}</span></div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <Vital icon={HeartPulse} label="HR"   value={`${active.hr}`} unit="bpm" tone={active.status} />
                  <Vital icon={Wind}       label="SpO₂" value={`${active.spo2}`} unit="%"  tone={active.status} />
                  <Vital icon={Thermometer} label="Temp" value={active.temp.toFixed(1)} unit="°C" tone={active.status} />
                </div>

                <div className="mt-5">
                  <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground mb-2">VITAL TREND · LAST 14m</div>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={vitals}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.01 270 / 0.15)" />
                      <XAxis dataKey="t" stroke="currentColor" fontSize={9} />
                      <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 11 }} />
                      <Line type="monotone" dataKey="hr" stroke="oklch(0.65 0.25 27)" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="spo2" stroke="oklch(0.62 0.18 250)" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 text-xs rounded-xl border border-border bg-surface-2 p-3 text-muted-foreground">
                  {active.note}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ChartCard title="Ward EWS distribution" icon={Activity}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={Array.from({ length: 24 }).map((_, i) => ({ t: `${i}h`, v: 20 + Math.round(Math.sin((i + tick) * 0.5) * 12 + Math.random() * 6) }))}>
                <defs>
                  <linearGradient id="cr1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.18 250)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.62 0.18 250)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.01 270 / 0.15)" />
                <XAxis dataKey="t" stroke="currentColor" fontSize={11} />
                <YAxis stroke="currentColor" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.62 0.18 250)" strokeWidth={2} fill="url(#cr1)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Claim variance by department (₹k)" icon={ShieldAlert}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={claim}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.01 270 / 0.15)" />
                <XAxis dataKey="t" stroke="currentColor" fontSize={11} />
                <YAxis stroke="currentColor" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="v" fill="oklch(0.65 0.25 27)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
}

function Vital({ icon: Icon, label, value, unit, tone }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; value: string; unit: string; tone: BedStatus }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <Icon className="h-3.5 w-3.5 mx-auto" style={{ color: statusColor[tone] }} />
      <div className="mt-1 font-display text-[9px] tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-lg tabular-nums">{value}<span className="text-[10px] text-muted-foreground ml-0.5">{unit}</span></div>
    </div>
  );
}
