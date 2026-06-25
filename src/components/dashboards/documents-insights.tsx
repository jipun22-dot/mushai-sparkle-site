import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Search, RefreshCw, FolderOpen, HardDrive, Clock, CheckCircle2, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

type ModuleKey = "nexus" | "environ" | "care";

type DocRow = {
  id: string;
  module: ModuleKey;
  doc_type: string;
  name: string;
  size_bytes: number;
  storage_path: string;
  status: string;
  created_at: string;
};

const docTypeLabel: Record<string, string> = {
  shift_log: "Shift handover log",
  production_report: "Production / OEE report",
  downtime_form: "Downtime form",
  qc_sheet: "Quality sheet",
  permit_to_work: "Permit to Work",
  msds: "MSDS sheet",
  inspection_round: "EHS inspection",
  incident_report: "Incident report",
  obs_chart: "Vitals chart",
  prescription: "Drug chart",
  lab_form: "Lab form",
  discharge_summary: "Discharge summary",
};

const insightCopy: Record<ModuleKey, string[]> = {
  nexus: [
    "Templates from {topType} are powering OEE extraction on the shop floor.",
    "Nexus indexed {count} document(s) — RCA suggestions improve with every shift report.",
    "Detected handwriting samples — auto-OCR confidence is climbing with each upload.",
  ],
  environ: [
    "Permits and MSDS sheets train Permit-Check on your site's tolerances.",
    "{count} EHS documents help flag missing signatures & expiring certifications.",
    "Inspection rounds map to your zone graph for live compliance scoring.",
  ],
  care: [
    "Observation charts let CARE compute EWS automatically from handwritten vitals.",
    "{count} clinical forms indexed — discharge summaries route to billing & coding.",
    "Drug charts strengthen MAR reconciliation across shifts.",
  ],
};

function fmtBytes(n: number) {
  if (!n) return "0 B";
  const k = 1024, units = ["B","KB","MB","GB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${(n / Math.pow(k, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}

function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export function DocumentsInsights({ module, accent }: { module: ModuleKey; accent: string }) {
  const { user } = useAuth();
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("onboarding_documents")
      .select("*")
      .eq("user_id", user.id)
      .eq("module", module)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setDocs((data ?? []) as DocRow[]);
    setLoading(false);
  };

  useEffect(() => { void load(); /* eslint-disable-next-line */ }, [module, user?.id]);

  const filtered = useMemo(
    () => docs.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()) || (docTypeLabel[d.doc_type] ?? d.doc_type).toLowerCase().includes(q.toLowerCase())),
    [docs, q],
  );

  const stats = useMemo(() => {
    const total = docs.length;
    const bytes = docs.reduce((s, d) => s + (d.size_bytes ?? 0), 0);
    const byType = docs.reduce<Record<string, number>>((m, d) => { m[d.doc_type] = (m[d.doc_type] ?? 0) + 1; return m; }, {});
    const topType = Object.entries(byType).sort((a,b) => b[1]-a[1])[0]?.[0];
    const trained = docs.filter((d) => d.status === "trained" || d.status === "indexed").length;
    const last = docs[0]?.created_at;
    return { total, bytes, byType, topType, trained, last };
  }, [docs]);

  const download = async (d: DocRow) => {
    setBusy(d.id);
    const { data, error } = await supabase.storage.from("onboarding-docs").createSignedUrl(d.storage_path, 60);
    setBusy(null);
    if (error || !data?.signedUrl) { toast.error(error?.message ?? "Could not create link"); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const reindex = async (d: DocRow) => {
    setBusy(d.id);
    const { error } = await supabase.from("onboarding_documents").update({ status: "indexed" }).eq("id", d.id);
    setBusy(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Re-queued for indexing");
    void load();
  };

  const copy = insightCopy[module];

  return (
    <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Insights */}
      <div className="xl:col-span-1 space-y-4">
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">DOC INTELLIGENCE</div>
              <div className="mt-1 font-display text-xl">Training corpus</div>
            </div>
            <Sparkles className="h-5 w-5" style={{ color: accent }} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat icon={FolderOpen} label="Documents" value={String(stats.total)} accent={accent} />
            <Stat icon={HardDrive} label="Storage" value={fmtBytes(stats.bytes)} accent={accent} />
            <Stat icon={CheckCircle2} label="Indexed" value={`${stats.trained}/${stats.total || 0}`} accent={accent} />
            <Stat icon={Clock} label="Last upload" value={stats.last ? timeAgo(stats.last) : "—"} accent={accent} />
          </div>

          <div className="mt-5">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5"><Layers className="h-3 w-3" /> By document type</div>
            <div className="space-y-1.5">
              {Object.entries(stats.byType).length === 0 && (
                <div className="text-sm text-muted-foreground">No documents yet — upload some to begin training.</div>
              )}
              {Object.entries(stats.byType).map(([k, v]) => {
                const pct = Math.round((v / Math.max(1, stats.total)) * 100);
                return (
                  <div key={k}>
                    <div className="flex justify-between text-xs">
                      <span className="truncate">{docTypeLabel[k] ?? k}</span>
                      <span className="text-muted-foreground">{v}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ background: accent }}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">AI INSIGHTS</div>
          <ul className="mt-3 space-y-2 text-sm">
            {copy.map((c, i) => (
              <motion.li key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex gap-2"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: accent }} />
                <span className="text-muted-foreground">
                  {c.replace("{count}", String(stats.total)).replace("{topType}", docTypeLabel[stats.topType ?? ""] ?? "uploaded templates")}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Document library */}
      <div className="xl:col-span-2 rounded-3xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">DOCUMENT LIBRARY</div>
            <div className="mt-1 font-display text-xl">Retrieve & manage uploads</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents…" className="pl-9 h-9 w-56 rounded-full bg-background" />
            </div>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => void load()}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Link to="/onboarding/$module" params={{ module }}>
              <Button size="sm" className="rounded-full text-white" style={{ background: accent }}>Upload</Button>
            </Link>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] tracking-[0.2em] text-muted-foreground bg-muted/40 uppercase">
            <div className="col-span-5">Name</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-1 text-right">Size</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
            {loading && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">Loading documents…</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="px-4 py-12 text-center">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="mt-3 text-sm text-muted-foreground">
                  {docs.length === 0 ? "No documents yet for this module." : "No documents match your search."}
                </div>
                {docs.length === 0 && (
                  <Link to="/onboarding/$module" params={{ module }}>
                    <Button size="sm" className="mt-4 rounded-full text-white" style={{ background: accent }}>Start onboarding</Button>
                  </Link>
                )}
              </div>
            )}
            {filtered.map((d) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30"
              >
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <span className="h-8 w-8 rounded-lg grid place-items-center shrink-0" style={{ background: `color-mix(in oklab, ${accent} 14%, transparent)`, color: accent }}>
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground">{timeAgo(d.created_at)}</div>
                  </div>
                </div>
                <div className="col-span-3 text-xs text-muted-foreground truncate">{docTypeLabel[d.doc_type] ?? d.doc_type}</div>
                <div className="col-span-1 text-xs text-right tabular-nums">{fmtBytes(d.size_bytes)}</div>
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider"
                    style={{
                      background: `color-mix(in oklab, ${accent} 12%, transparent)`,
                      color: accent,
                    }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} /> {d.status}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" title="Re-index" onClick={() => void reindex(d)} disabled={busy === d.id}>
                    <RefreshCw className={`h-3.5 w-3.5 ${busy === d.id ? "animate-spin" : ""}`} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" title="Download" onClick={() => void download(d)} disabled={busy === d.id}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: typeof FolderOpen; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-border p-3 bg-background">
      <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        <Icon className="h-3 w-3" style={{ color: accent }} /> {label}
      </div>
      <div className="mt-1 font-display text-xl tabular-nums">{value}</div>
    </div>
  );
}
