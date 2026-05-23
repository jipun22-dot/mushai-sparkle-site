import { useMemo } from "react";
import { motion } from "framer-motion";

export type HeatmapVariant = "factory" | "industrial" | "ward";

type Cell = { x: number; y: number; v: number; label?: string };

const seed = (n: number) => {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

function generate(variant: HeatmapVariant): { cells: Cell[]; cols: number; rows: number; hotspots: { x: number; y: number; label: string }[] } {
  const cfg = {
    factory:    { cols: 18, rows: 10, seed: 7,  hotspots: [{ x: 4, y: 3, label: "Line 2 — Floor-Pulse spike" }, { x: 13, y: 6, label: "Press bay overheat" }] },
    industrial: { cols: 20, rows: 12, seed: 22, hotspots: [{ x: 6, y: 4, label: "Tank-farm vent alarm" }, { x: 15, y: 9, label: "Permit expiring · Zone D" }] },
    ward:       { cols: 16, rows: 8,  seed: 41, hotspots: [{ x: 5, y: 2, label: "ICU bay 3 — Vital-View alert" }, { x: 11, y: 5, label: "Ward 4 staffing dip" }] },
  }[variant];

  const r = seed(cfg.seed);
  const cells: Cell[] = [];
  for (let y = 0; y < cfg.rows; y++) {
    for (let x = 0; x < cfg.cols; x++) {
      let v = r() * 0.5 + 0.1;
      cfg.hotspots.forEach((h) => {
        const d = Math.hypot(h.x - x, h.y - y);
        v += Math.max(0, 1 - d / 4) * 0.9;
      });
      cells.push({ x, y, v: Math.min(1, v) });
    }
  }
  return { cells, cols: cfg.cols, rows: cfg.rows, hotspots: cfg.hotspots };
}

const labels: Record<HeatmapVariant, { title: string; sub: string; legend: [string, string]; accent: string }> = {
  factory:    { title: "Factory Floor — Live",      sub: "Floor-Pulse · last 60s",        legend: ["Idle", "Hot"], accent: "var(--nexus)" },
  industrial: { title: "Industrial Site — Live",    sub: "Permit & emission load",        legend: ["Safe", "Risk"], accent: "var(--environ)" },
  ward:       { title: "Hospital Wards — Live",     sub: "Vital-View early warning",      legend: ["Stable", "Critical"], accent: "var(--care)" },
};

export function Heatmap({ variant }: { variant: HeatmapVariant }) {
  const { cells, cols, rows, hotspots } = useMemo(() => generate(variant), [variant]);
  const meta = labels[variant];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-[10px] tracking-[0.32em] text-muted-foreground">LIVE HEATMAP</div>
          <h3 className="mt-1.5 text-lg font-semibold">{meta.title}</h3>
          <div className="text-xs text-muted-foreground">{meta.sub}</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: meta.accent }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: meta.accent }} />
          </span>
          <span className="text-muted-foreground">streaming</span>
        </div>
      </div>

      <div
        className="mt-5 grid gap-[3px] rounded-2xl bg-surface-2 p-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (i / (cols * rows)) * 0.6, duration: 0.4 }}
            className="aspect-square rounded-[3px]"
            style={{
              background: `color-mix(in oklab, ${meta.accent} ${Math.round(c.v * 100)}%, transparent)`,
              boxShadow: c.v > 0.85 ? `0 0 12px ${meta.accent}` : undefined,
            }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{meta.legend[0]}</span>
          <div className="h-1.5 w-32 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${meta.accent})` }} />
          <span>{meta.legend[1]}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {hotspots.map((h, i) => (
            <span key={i} className="rounded-full border border-border bg-surface px-2.5 py-1">⚠ {h.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
