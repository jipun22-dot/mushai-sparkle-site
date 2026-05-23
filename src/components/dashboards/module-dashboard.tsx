import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, BarChart, CartesianGrid } from "recharts";
import { Heatmap, type HeatmapVariant } from "./heatmap";
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

type DashboardProps = {
  variant: HeatmapVariant;
  kpis: { label: string; value: string; delta: string; tone: "up" | "down" | "warn" }[];
  trendName: string;
  trendData: { t: string; v: number }[];
  barName: string;
  barData: { t: string; v: number }[];
  events: { time: string; text: string; tone: "ok" | "warn" | "alert" }[];
};

const tones = {
  up: "text-emerald-500",
  down: "text-primary",
  warn: "text-amber-500",
  ok: "text-emerald-500",
  alert: "text-primary",
};

export function ModuleDashboard(props: DashboardProps) {
  return (
    <section className="relative py-20 bg-surface-2/40">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="font-display text-xs tracking-[0.32em] text-primary">LIVE DASHBOARD</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold">A control surface, not a report.</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> All systems streaming
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {props.kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{k.label}</div>
              <div className="mt-3 text-2xl font-semibold font-heading">{k.value}</div>
              <div className={`mt-1 text-xs font-medium ${tones[k.tone]}`}>{k.delta}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2"><Heatmap variant={props.variant} /></div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">EVENT STREAM</div>
            <h3 className="mt-1.5 text-lg font-semibold">Auto-detected today</h3>
            <ul className="mt-5 space-y-4">
              {props.events.map((e, i) => {
                const Icon = e.tone === "alert" ? AlertTriangle : e.tone === "warn" ? Clock : CheckCircle2;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3 text-sm"
                  >
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tones[e.tone]}`} />
                    <div>
                      <div>{e.text}</div>
                      <div className="text-xs text-muted-foreground">{e.time}</div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card title={props.trendName} icon={Activity}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={props.trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.25 27)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.65 0.25 27)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.01 270 / 0.15)" />
                <XAxis dataKey="t" stroke="currentColor" fontSize={11} />
                <YAxis stroke="currentColor" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.65 0.25 27)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
          <Card title={props.barName} icon={Activity}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={props.barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.01 270 / 0.15)" />
                <XAxis dataKey="t" stroke="currentColor" fontSize={11} />
                <YAxis stroke="currentColor" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="v" fill="oklch(0.65 0.25 27)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
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
