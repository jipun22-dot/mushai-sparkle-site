import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, AlertTriangle, CheckCircle2, Clock, Cog, Factory, ShieldCheck, Zap } from "lucide-react";

type LineStatus = "running" | "idle" | "fault";
type Line = {
  id: string;
  name: string;
  oee: number;
  output: number;
  target: number;
  status: LineStatus;
  operator: string;
  product: string;
  uptime: number;
  events: { time: string; text: string; tone: "ok" | "warn" | "alert" }[];
};

const initialLines: Line[] = [
  { id: "L1", name: "Line 1 · Assembly", oee: 87, output: 412, target: 480, status: "running", operator: "S. Rao",   product: "SKU-A28", uptime: 96, events: [{ time: "12m", text: "Throughput stabilized after operator changeover.", tone: "ok" }] },
  { id: "L2", name: "Line 2 · Press Bay", oee: 64, output: 288, target: 460, status: "fault",   operator: "R. Khan",  product: "SKU-P14", uptime: 81, events: [{ time: "4m",  text: "Idle spike — supervisor pinged.", tone: "alert" }, { time: "22m", text: "Hydraulic pressure variance.", tone: "warn" }] },
  { id: "L3", name: "Line 3 · Weld",      oee: 92, output: 461, target: 470, status: "running", operator: "M. Iyer",  product: "SKU-W09", uptime: 99, events: [{ time: "1h", text: "Cell 3 — zero scrap shift so far.", tone: "ok" }] },
  { id: "L4", name: "Line 4 · Paint",     oee: 71, output: 297, target: 420, status: "idle",    operator: "P. Devi",  product: "SKU-X02", uptime: 88, events: [{ time: "9m",  text: "Paused for paint refill.", tone: "warn" }] },
  { id: "L5", name: "Line 5 · Pack",      oee: 89, output: 502, target: 520, status: "running", operator: "T. Singh", product: "SKU-K33", uptime: 97, events: [{ time: "31m", text: "Carton scanner re-calibrated.", tone: "ok" }] },
];

const trendBase = [71, 68, 75, 82, 79, 86, 84, 81, 78, 83, 88, 85];

const statusColor: Record<LineStatus, string> = {
  running: "var(--environ)",
  idle:    "oklch(0.78 0.16 75)",
  fault:   "var(--primary)",
};

export function NexusDashboard() {
  const [lines, setLines] = useState(initialLines);
  const [activeId, setActiveId] = useState<string>("L2");
  const [shift, setShift] = useState<"A" | "B" | "C">("B");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLines((prev) =>
        prev.map((l) => {
          const delta = (Math.random() - 0.5) * 6;
          const oee = Math.max(40, Math.min(98, Math.round(l.oee + delta)));
          const output = Math.max(100, Math.round(l.output + (Math.random() - 0.4) * 12));
          const status: LineStatus = oee < 70 ? "fault" : oee < 78 ? "idle" : "running";
          return { ...l, oee, output, status };
        }),
      );
      setTick((t) => t + 1);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const active = lines.find((l) => l.id === activeId)!;
  const totalOutput = lines.reduce((a, l) => a + l.output, 0);
  const avgOee = Math.round(lines.reduce((a, l) => a + l.oee, 0) / lines.length);
  const faults = lines.filter((l) => l.status === "fault").length;

  const trend = useMemo(
    () => trendBase.map((v, i) => ({ t: `${i.toString().padStart(2, "0")}h`, v: Math.max(50, v + Math.round(Math.sin((i + tick) * 0.6) * 6)) })),
    [tick],
  );

  return (
    <section className="relative py-20 bg-surface-2/40">
      <div className="mx-auto max-w-7xl px-5">
        <DashboardHeader
          kicker="NEXUS · FACTORY CONTROL"
          title="The shop-floor, in one glance."
          shift={shift}
          onShift={setShift}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={Factory} label="Avg OEE" value={`${avgOee}%`} delta="+6.1% w/w" tone="up" />
          <Kpi icon={Zap}     label="Units · shift" value={totalOutput.toLocaleString()} delta={`${shift} · live`} tone="up" />
          <Kpi icon={AlertTriangle} label="Active faults" value={faults.toString()} delta={faults ? "supervisor pinged" : "all clear"} tone={faults ? "warn" : "up"} />
          <Kpi icon={ShieldCheck} label="Comp certs" value="98.2%" delta="12 expiring 30d" tone="warn" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          {/* FACTORY LINE SCHEMATIC */}
          <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">FLOOR-PULSE</div>
                <h3 className="mt-1.5 text-lg font-semibold">Production lines · interactive</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                {(["running","idle","fault"] as LineStatus[]).map((s) => (
                  <div key={s} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: statusColor[s] }} />{s}</div>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {lines.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveId(l.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${
                    activeId === l.id ? "border-primary/50 bg-primary/5" : "border-border bg-surface-2 hover:bg-card"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-9 w-9 place-items-center rounded-xl text-white shrink-0" style={{ background: statusColor[l.status] }}>
                      <Cog className={`h-4 w-4 ${l.status === "running" ? "animate-spin-slow" : ""}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium truncate">{l.name}</div>
                        <div className="font-display text-sm" style={{ color: statusColor[l.status] }}>{l.oee}%</div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden relative">
                          <motion.div
                            animate={{ width: `${l.oee}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ background: statusColor[l.status] }}
                          />
                          {l.status === "running" && (
                            <motion.div
                              className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                              animate={{ x: ["-50%", "350%"] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground tabular-nums w-20 text-right">{l.output}/{l.target}u</div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* LINE DETAIL */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">LINE DETAIL</div>
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: statusColor[active.status] }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="mt-2 text-2xl font-semibold">{active.name}</h3>
                <div className="mt-1 text-xs text-muted-foreground">Operator: {active.operator} · Product: {active.product}</div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <MiniStat label="OEE" value={`${active.oee}%`} />
                  <MiniStat label="Output" value={`${active.output}`} />
                  <MiniStat label="Uptime" value={`${active.uptime}%`} />
                </div>
                <div className="mt-5">
                  <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground mb-3">EVENTS</div>
                  <ul className="space-y-3">
                    {active.events.map((e, i) => {
                      const Icon = e.tone === "alert" ? AlertTriangle : e.tone === "warn" ? Clock : CheckCircle2;
                      const c = e.tone === "alert" ? "var(--primary)" : e.tone === "warn" ? "oklch(0.78 0.16 75)" : "var(--environ)";
                      return (
                        <li key={i} className="flex gap-3 text-sm">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c }} />
                          <div className="min-w-0">
                            <div>{e.text}</div>
                            <div className="text-[11px] text-muted-foreground">{e.time} ago</div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ChartCard title="OEE · last 12 hours" icon={Activity}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="nx1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.25 27)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.65 0.25 27)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.01 270 / 0.15)" />
                <XAxis dataKey="t" stroke="currentColor" fontSize={11} />
                <YAxis stroke="currentColor" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.65 0.25 27)" strokeWidth={2} fill="url(#nx1)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Output by line · this shift" icon={Factory}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={lines.map((l) => ({ t: l.id, v: l.output, target: l.target }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.01 270 / 0.15)" />
                <XAxis dataKey="t" stroke="currentColor" fontSize={11} />
                <YAxis stroke="currentColor" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="target" fill="oklch(0.5 0.01 270 / 0.2)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="v" fill="oklch(0.65 0.25 27)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
}

/* shared header / kpi / mini-stat / chart-card */
export function DashboardHeader({ kicker, title, shift, onShift }: { kicker: string; title: string; shift: string; onShift: (s: "A" | "B" | "C") => void }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <div className="font-display text-xs tracking-[0.32em] text-primary">{kicker}</div>
        <h2 className="mt-3 text-3xl md:text-4xl font-semibold">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
          {(["A","B","C"] as const).map((s) => (
            <button key={s} onClick={() => onShift(s)}
              className={`text-[10px] font-display tracking-[0.2em] px-3 py-1.5 rounded-full transition-colors ${
                shift === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>SHIFT {s}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> streaming
        </div>
      </div>
    </div>
  );
}

export function Kpi({ icon: Icon, label, value, delta, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string; tone: "up" | "warn" | "down" }) {
  const c = tone === "up" ? "var(--environ)" : tone === "warn" ? "oklch(0.78 0.16 75)" : "var(--primary)";
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
      </div>
      <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold font-heading tabular-nums">{value}</div>
      <div className="mt-1 text-xs font-medium" style={{ color: c }}>{delta}</div>
    </motion.div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <div className="font-display text-[9px] tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg tabular-nums">{value}</div>
    </div>
  );
}

export function ChartCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
}
