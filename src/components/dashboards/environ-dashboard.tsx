import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, FileCheck2, Leaf, ShieldCheck, Wind, Droplets } from "lucide-react";
import { LiveTicker, ActionQueue } from "./dashboard-extras";
import { DashboardHeader, Kpi, ChartCard } from "./nexus-dashboard";

type ZoneStatus = "safe" | "watch" | "risk";
type Zone = {
  id: string;
  name: string;
  status: ZoneStatus;
  permits: number;
  expiring: number;
  emission: number; // tCO2/wk
  x: number; y: number; w: number; h: number;
  obs: string;
};

const initialZones: Zone[] = [
  { id: "A", name: "Tank Farm",   status: "risk",  permits: 18, expiring: 4, emission: 62, x: 4,  y: 6,  w: 28, h: 38, obs: "Vent alarm · 2 active permits" },
  { id: "B", name: "Press Bay",   status: "watch", permits: 22, expiring: 2, emission: 41, x: 36, y: 6,  w: 30, h: 22, obs: "Hot Work permit expiring < 7d" },
  { id: "C", name: "Warehouse",   status: "safe",  permits: 31, expiring: 0, emission: 14, x: 70, y: 6,  w: 26, h: 22, obs: "All clear · last audit 3d ago" },
  { id: "D", name: "Effluent",    status: "risk",  permits: 9,  expiring: 3, emission: 38, x: 36, y: 32, w: 30, h: 22, obs: "pH variance flagged 14 min ago" },
  { id: "E", name: "Workshop",    status: "watch", permits: 14, expiring: 1, emission: 22, x: 70, y: 32, w: 26, h: 22, obs: "Cert renewal pending · 6 ops" },
  { id: "F", name: "Loading Bay", status: "safe",  permits: 11, expiring: 0, emission: 9,  x: 4,  y: 48, w: 28, h: 14, obs: "Routine ops · no incidents" },
  { id: "G", name: "Yard",        status: "safe",  permits: 7,  expiring: 0, emission: 6,  x: 36, y: 58, w: 60, h: 14, obs: "Diesel receipts reconciled" },
];

const statusColor: Record<ZoneStatus, string> = {
  safe:  "var(--environ)",
  watch: "oklch(0.78 0.16 75)",
  risk:  "var(--primary)",
};

const certData = [
  { name: "Valid", value: 86 },
  { name: "Expiring <30d", value: 11 },
  { name: "Expired", value: 3 },
];

const trendBase = [210, 205, 198, 201, 192, 188, 184, 182];

export function EnvironDashboard() {
  const [zones, setZones] = useState(initialZones);
  const [activeId, setActiveId] = useState("A");
  const [shift, setShift] = useState<"A" | "B" | "C">("B");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setZones((prev) =>
        prev.map((z) => {
          const emission = Math.max(2, Math.round(z.emission + (Math.random() - 0.5) * 6));
          const status: ZoneStatus = emission > 50 || z.expiring > 3 ? "risk" : emission > 25 || z.expiring > 0 ? "watch" : "safe";
          return { ...z, emission, status };
        }),
      );
      setTick((t) => t + 1);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const active = zones.find((z) => z.id === activeId)!;
  const totalEmission = zones.reduce((a, z) => a + z.emission, 0);
  const totalExpiring = zones.reduce((a, z) => a + z.expiring, 0);
  const risks = zones.filter((z) => z.status === "risk").length;

  const trend = useMemo(
    () => trendBase.map((v, i) => ({ t: `W${i + 1}`, v: Math.max(150, v + Math.round(Math.sin((i + tick) * 0.5) * 8)) })),
    [tick],
  );

  return (
    <section className="relative py-20 bg-surface-2/40">
      <div className="mx-auto max-w-7xl px-5">
        <DashboardHeader kicker="ENVIRON · SITE CONTROL" title="Permits, emissions, every zone — live." shift={shift} onShift={setShift} />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={FileCheck2}     label="Active permits"    value={zones.reduce((a, z) => a + z.permits, 0).toString()} delta={`${totalExpiring} expiring < 7d`} tone={totalExpiring ? "warn" : "up"} />
          <Kpi icon={AlertTriangle}  label="Risk zones"        value={risks.toString()} delta={risks ? "intervene now" : "all clear"} tone={risks ? "warn" : "up"} />
          <Kpi icon={Leaf}           label="Emissions · wk"    value={`${totalEmission}t`} delta="−6.4% MoM" tone="up" />
          <Kpi icon={ShieldCheck}    label="Audit-ready zones" value="94%" delta="Zone D pending" tone="warn" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          {/* SITE MAP */}
          <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">SITE LAYOUT</div>
                <h3 className="mt-1.5 text-lg font-semibold">Industrial zones · click to inspect</h3>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                {(["safe","watch","risk"] as ZoneStatus[]).map((s) => (
                  <div key={s} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: statusColor[s] }} />{s}</div>
                ))}
              </div>
            </div>

            <div className="mt-5 relative w-full aspect-[16/10] rounded-2xl bg-surface-2 border border-border overflow-hidden">
              {/* roads */}
              <div className="absolute left-0 right-0 top-[46%] h-[6%] bg-[oklch(0.5_0.01_270/0.08)]" />
              <div className="absolute top-0 bottom-0 left-[34%] w-[2%] bg-[oklch(0.5_0.01_270/0.08)]" />
              {zones.map((z) => {
                const isActive = z.id === activeId;
                return (
                  <motion.button
                    key={z.id}
                    onClick={() => setActiveId(z.id)}
                    initial={false}
                    animate={{ scale: isActive ? 1.02 : 1 }}
                    className={`absolute rounded-xl border-2 text-left p-2.5 overflow-hidden transition-shadow ${isActive ? "shadow-elegant z-10" : "hover:z-10"}`}
                    style={{
                      left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`,
                      background: `color-mix(in oklab, ${statusColor[z.status]} 18%, var(--card))`,
                      borderColor: isActive ? statusColor[z.status] : "color-mix(in oklab, " + statusColor[z.status] + " 35%, transparent)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[10px] tracking-[0.2em]">{z.id}</span>
                      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: statusColor[z.status] }} />
                    </div>
                    <div className="text-[11px] font-medium mt-0.5 truncate">{z.name}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">{z.emission}t · {z.permits}p</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ZONE DETAIL */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">ZONE DETAIL</div>
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: statusColor[active.status] }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={active.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <h3 className="mt-2 text-2xl font-semibold">Zone {active.id} · {active.name}</h3>
                <div className="mt-1 text-xs text-muted-foreground">{active.obs}</div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-border bg-surface-2 p-3">
                    <div className="font-display text-[9px] tracking-[0.2em] text-muted-foreground">PERMITS</div>
                    <div className="mt-1 font-display text-lg tabular-nums">{active.permits}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-2 p-3">
                    <div className="font-display text-[9px] tracking-[0.2em] text-muted-foreground">EXPIRING</div>
                    <div className="mt-1 font-display text-lg tabular-nums">{active.expiring}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-2 p-3">
                    <div className="font-display text-[9px] tracking-[0.2em] text-muted-foreground">EMISSION</div>
                    <div className="mt-1 font-display text-lg tabular-nums">{active.emission}t</div>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5">
                  <Row icon={Wind} label="Air load" value={`${Math.round(active.emission * 1.4)} ppm`} tone={active.status} />
                  <Row icon={Droplets} label="Effluent pH" value={active.id === "D" ? "8.4 · variance" : "7.1 · ok"} tone={active.id === "D" ? "risk" : "safe"} />
                  <Row icon={ShieldCheck} label="Last audit" value={active.status === "risk" ? "Today · open finding" : "3 days ago"} tone={active.status} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ChartCard title="Emission load (tCO₂) · last 8 weeks" icon={Leaf}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="en1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.18 155)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.62 0.18 155)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.01 270 / 0.15)" />
                <XAxis dataKey="t" stroke="currentColor" fontSize={11} />
                <YAxis stroke="currentColor" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.62 0.18 155)" strokeWidth={2} fill="url(#en1)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Certification health" icon={ShieldCheck}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={certData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} stroke="none">
                  {certData.map((_, i) => (
                    <Cell key={i} fill={[ "oklch(0.62 0.18 155)", "oklch(0.78 0.16 75)", "oklch(0.65 0.25 27)" ][i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-4 text-[11px] text-muted-foreground">
              {certData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: ["oklch(0.62 0.18 155)","oklch(0.78 0.16 75)","oklch(0.65 0.25 27)"][i] }} />
                  {d.name} · {d.value}%
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <LiveTicker
            kicker="Permit-Check · live compliance feed"
            accent="var(--environ)"
            events={[
              { time: "20s", text: "Hot-work permit HW-2241 issued · Zone B Press Bay.",        tone: "ok",    tag: "PERMIT" },
              { time: "1m",  text: "Effluent pH variance flagged at Zone D · auto-sample sent.",tone: "alert", tag: "ZONE D" },
              { time: "3m",  text: "Cert renewed: Confined-Space · 6 operators.",              tone: "ok",    tag: "CERT"   },
              { time: "5m',", text: "Tank Farm vent reading back inside threshold.",            tone: "warn",  tag: "ZONE A" },
              { time: "8m",  text: "Quarterly carbon report draft generated · 184t.",          tone: "ok",    tag: "ECO"    },
              { time: "12m", text: "Audit finding closed: PPE compliance Zone E.",             tone: "ok",    tag: "AUDIT"  },
            ]}
          />
          <ActionQueue
            kicker="EHS lead action queue"
            items={[
              { id: "e1", title: "Investigate Zone D effluent pH variance",  meta: "raised 14m ago · sample pending", priority: "high" },
              { id: "e2", title: "Sign Hot-Work permit HW-2241",             meta: "Zone B · expires in 7 days",      priority: "med"  },
              { id: "e3", title: "Renew 4 confined-space certs",             meta: "Zone E · expiring < 30d",         priority: "med"  },
              { id: "e4", title: "Approve quarterly carbon report",          meta: "Eco-Audit · 184t total",          priority: "low"  },
              { id: "e5", title: "Close audit finding · PPE Zone E",         meta: "evidence uploaded by S. Iyer",    priority: "low"  },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function Row({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; value: string; tone: ZoneStatus }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
      <Icon className="h-4 w-4" style={{ color: statusColor[tone] }} />
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="ml-auto text-sm tabular-nums">{value}</div>
    </div>
  );
}
