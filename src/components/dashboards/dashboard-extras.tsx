import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CheckCircle2, Clock, Radio } from "lucide-react";

export type TickerEvent = { time: string; text: string; tone: "ok" | "warn" | "alert"; tag: string };

export function LiveTicker({ kicker, events: seed, accent }: { kicker: string; events: TickerEvent[]; accent: string }) {
  const [events, setEvents] = useState<TickerEvent[]>(seed);

  useEffect(() => {
    const id = setInterval(() => {
      setEvents((prev) => {
        const next = [...prev];
        const head = next.shift();
        if (head) next.push({ ...head, time: "just now" });
        return next;
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const toneColor = (t: TickerEvent["tone"]) =>
    t === "alert" ? "var(--primary)" : t === "warn" ? "oklch(0.78 0.16 75)" : "var(--environ)";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">{kicker}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> streaming
        </div>
      </div>
      <div className="mt-4 relative h-[220px] overflow-hidden [mask-image:linear-gradient(180deg,transparent,black_12%,black_88%,transparent)]">
        <AnimatePresence initial={false}>
          {events.slice(0, 6).map((e, i) => (
            <motion.div
              key={`${e.text}-${i}`}
              layout
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35 }}
              className="flex items-start gap-3 py-2 border-b border-border/60 last:border-0"
            >
              <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: toneColor(e.tone) }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[9px] tracking-[0.22em] text-muted-foreground">{e.tag}</span>
                  <span className="text-[10px] text-muted-foreground">· {e.time}</span>
                </div>
                <div className="mt-0.5 text-sm truncate">{e.text}</div>
              </div>
              <span className="text-[10px] font-display tracking-[0.18em]" style={{ color: accent }}>LIVE</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export type ActionItem = { id: string; title: string; meta: string; priority: "low" | "med" | "high" };

export function ActionQueue({ kicker, items: seed }: { kicker: string; items: ActionItem[] }) {
  const [items, setItems] = useState(seed);
  const [done, setDone] = useState<string[]>([]);

  const complete = (id: string) => {
    setDone((d) => [...d, id]);
    setTimeout(() => setItems((arr) => arr.filter((i) => i.id !== id)), 350);
  };

  const pColor = (p: ActionItem["priority"]) =>
    p === "high" ? "var(--primary)" : p === "med" ? "oklch(0.78 0.16 75)" : "var(--environ)";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">{kicker}</h3>
        </div>
        <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground">{items.length} OPEN</span>
      </div>
      <ul className="mt-4 space-y-2.5">
        <AnimatePresence initial={false}>
          {items.map((i) => {
            const isDone = done.includes(i.id);
            return (
              <motion.li
                key={i.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isDone ? 0.4 : 1, y: 0 }}
                exit={{ opacity: 0, x: -40, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2 p-3"
              >
                <button
                  onClick={() => complete(i.id)}
                  className={`h-5 w-5 rounded-md border grid place-items-center transition-colors ${isDone ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                  aria-label="Mark resolved"
                >
                  {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm truncate ${isDone ? "line-through text-muted-foreground" : ""}`}>{i.title}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3 w-3" /> {i.meta}
                  </div>
                </div>
                <span className="font-display text-[9px] tracking-[0.2em] px-2 py-1 rounded-full" style={{ background: `color-mix(in oklab, ${pColor(i.priority)} 18%, transparent)`, color: pColor(i.priority) }}>{i.priority.toUpperCase()}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
