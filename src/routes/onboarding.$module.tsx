import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Upload, FileText, Trash2, Loader2, CheckCircle2, ArrowLeft, Factory, Leaf, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthGate } from "@/components/auth-gate";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

type ModuleKey = "nexus" | "environ" | "care";

const moduleConfig: Record<ModuleKey, {
  name: string; color: string; icon: typeof Factory; tagline: string;
  docTypes: { id: string; label: string; hint: string }[];
}> = {
  nexus: {
    name: "Nexus", color: "var(--nexus)", icon: Factory,
    tagline: "Teach Nexus your shift logs, production reports and machine forms.",
    docTypes: [
      { id: "shift_log", label: "Shift handover log", hint: "Handwritten or printed shift report templates." },
      { id: "production_report", label: "Production / OEE report", hint: "Daily or hourly output sheets." },
      { id: "downtime_form", label: "Downtime / breakdown form", hint: "Stoppage and root-cause cards." },
      { id: "qc_sheet", label: "Quality / inspection sheet", hint: "Inline QC, in-process checks, gauges." },
    ],
  },
  environ: {
    name: "Environ", color: "var(--environ)", icon: Leaf,
    tagline: "Train Environ on your permits, MSDS sheets and inspection rounds.",
    docTypes: [
      { id: "permit_to_work", label: "Permit to Work", hint: "Hot work, confined-space, height, electrical permits." },
      { id: "msds", label: "MSDS / chemical sheet", hint: "Material safety data sheets and chemical inventory." },
      { id: "inspection_round", label: "EHS inspection round", hint: "Daily/weekly safety walk checklists." },
      { id: "incident_report", label: "Incident / near-miss report", hint: "Incident investigation templates." },
    ],
  },
  care: {
    name: "Care", color: "var(--care)", icon: HeartPulse,
    tagline: "Show Care your observation charts, prescriptions and lab forms.",
    docTypes: [
      { id: "obs_chart", label: "Observation / vitals chart", hint: "Handwritten hourly vitals & EWS charts." },
      { id: "prescription", label: "Prescription / drug chart", hint: "Inpatient medication records." },
      { id: "lab_form", label: "Lab requisition / report", hint: "Pathology and radiology forms." },
      { id: "discharge_summary", label: "Discharge summary", hint: "Discharge note templates." },
    ],
  },
};

export const Route = createFileRoute("/onboarding/$module")({
  parseParams: (p) => ({ module: p.module as ModuleKey }),
  head: () => ({ meta: [{ title: "Onboarding — Mushai Systems" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <AuthGate title="Sign in to upload documents">
      <OnboardingInner />
    </AuthGate>
  );
}

type Doc = {
  id: string; name: string; doc_type: string; size_bytes: number;
  storage_path: string; created_at: string; status: string;
};

function OnboardingInner() {
  const { module } = useParams({ from: "/onboarding/$module" });
  const cfg = moduleConfig[module] ?? moduleConfig.nexus;
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>(cfg.docTypes[0].id);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("onboarding_documents")
      .select("id,name,doc_type,size_bytes,storage_path,created_at,status")
      .eq("module", module)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setDocs((data as Doc[]) ?? []);
    setLoading(false);
  }, [user, module]);

  useEffect(() => {
    setActiveType(cfg.docTypes[0].id);
    fetchDocs();
  }, [module, cfg, fetchDocs]);

  async function uploadFiles(files: FileList | File[]) {
    if (!user) return;
    setUploading(true);
    const list = Array.from(files);
    let ok = 0;
    for (const file of list) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user.id}/${module}/${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from("onboarding-docs").upload(path, file, { upsert: false });
      if (upErr) { toast.error(`${file.name}: ${upErr.message}`); continue; }
      const { error: insErr } = await supabase.from("onboarding_documents").insert({
        user_id: user.id, module, doc_type: activeType, name: file.name,
        size_bytes: file.size, storage_path: path, status: "uploaded",
      });
      if (insErr) { toast.error(`${file.name}: ${insErr.message}`); continue; }
      ok++;
    }
    if (ok) toast.success(`${ok} file${ok > 1 ? "s" : ""} uploaded · queued for training`);
    setUploading(false);
    fetchDocs();
  }

  async function removeDoc(d: Doc) {
    await supabase.storage.from("onboarding-docs").remove([d.storage_path]);
    const { error } = await supabase.from("onboarding_documents").delete().eq("id", d.id);
    if (error) toast.error(error.message);
    else { toast.success("Removed"); fetchDocs(); }
  }

  const totalSize = useMemo(() => docs.reduce((s, d) => s + (d.size_bytes ?? 0), 0), [docs]);
  const Icon = cfg.icon;

  return (
    <section className="relative pt-12 pb-24">
      <div className="mx-auto max-w-7xl px-5">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </Link>

        <div className="mt-6 grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 rounded-[28px] border border-border bg-card p-8 shadow-elegant">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1.5 text-[10px]" style={{ color: cfg.color }}>
              <Icon className="h-3 w-3" />
              <span className="font-display tracking-[0.28em]">{cfg.name.toUpperCase()} ONBOARDING</span>
            </div>
            <h1 className="mt-5 font-display text-3xl md:text-4xl tracking-tight">Train {cfg.name} on your paperwork.</h1>
            <p className="mt-3 text-sm text-muted-foreground">{cfg.tagline}</p>

            <div className="mt-6">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Pick a document type</div>
              <div className="flex flex-wrap gap-2">
                {cfg.docTypes.map((t) => {
                  const isActive = t.id === activeType;
                  return (
                    <button key={t.id} onClick={() => setActiveType(t.id)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${isActive ? "border-transparent text-white" : "border-border hover:bg-accent"}`}
                      style={isActive ? { background: cfg.color } : undefined}>
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{cfg.docTypes.find((t) => t.id === activeType)?.hint}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Documents</div>
                <div className="mt-1 font-display text-2xl">{docs.length}</div>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Storage</div>
                <div className="mt-1 font-display text-2xl">{(totalSize / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <motion.div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); }}
              animate={{ borderColor: dragOver ? cfg.color : "var(--border)" }}
              className="relative rounded-[28px] border-2 border-dashed bg-card/50 p-10 text-center"
            >
              <input ref={inputRef} type="file" multiple className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff,.heic,.doc,.docx,.xls,.xlsx,.csv"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ background: cfg.color }}>
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
              </div>
              <h3 className="mt-5 font-display text-xl">Drop documents to train the module</h3>
              <p className="mt-2 text-sm text-muted-foreground">PDF, images, Word, Excel. Up to ~25 MB each.</p>
              <Button onClick={() => inputRef.current?.click()} disabled={uploading} className="mt-5 rounded-full bg-primary hover:bg-primary/90">
                {uploading ? "Uploading…" : "Choose files"}
              </Button>
            </motion.div>

            <div className="rounded-[28px] border border-border bg-card">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="font-display text-sm tracking-[0.2em] uppercase">Uploaded documents</div>
                <div className="text-xs text-muted-foreground">{loading ? "Loading…" : `${docs.length} total`}</div>
              </div>
              <div className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {docs.length === 0 && !loading && (
                    <div className="px-6 py-10 text-center text-sm text-muted-foreground">No documents yet — uploads appear here.</div>
                  )}
                  {docs.map((d) => {
                    const type = cfg.docTypes.find((t) => t.id === d.doc_type);
                    return (
                      <motion.div key={d.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-4 px-6 py-4">
                        <div className="h-10 w-10 grid place-items-center rounded-xl border border-border"><FileText className="h-4 w-4" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{d.name}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {type?.label ?? d.doc_type} · {(d.size_bytes / 1024).toFixed(0)} KB · {new Date(d.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-xs" style={{ color: cfg.color }}>
                          <CheckCircle2 className="h-3.5 w-3.5" /> {d.status}
                        </div>
                        <button onClick={() => removeDoc(d)} className="text-muted-foreground hover:text-destructive p-2" aria-label="Remove">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
