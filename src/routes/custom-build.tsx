import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Factory, Leaf, HeartPulse, ShieldCheck, BarChart3, Workflow, Plug, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/custom-build")({
  head: () => ({
    meta: [
      { title: "Custom Build — Mushai Systems" },
      { name: "description", content: "Compose a private Mushai module from sub-modules tailored to your floor." },
    ],
  }),
  component: CustomBuild,
});

type Item = { id: string; name: string; group: string; icon: React.ComponentType<{ className?: string }>; price: number };

const catalog: Item[] = [
  { id: "gate", name: "Gate-Keep", group: "Nexus", icon: ShieldCheck, price: 15000 },
  { id: "pulse", name: "Floor-Pulse", group: "Nexus", icon: Factory, price: 22000 },
  { id: "lab", name: "Lab-Link", group: "Nexus", icon: Workflow, price: 18000 },
  { id: "work", name: "Work-Force", group: "Nexus", icon: BarChart3, price: 16000 },
  { id: "permit", name: "Permit-Check", group: "Environ", icon: ShieldCheck, price: 14000 },
  { id: "cert", name: "Cert-Watch", group: "Environ", icon: Check, price: 12000 },
  { id: "log", name: "Log-Vision", group: "Environ", icon: Workflow, price: 13000 },
  { id: "eco", name: "Eco-Audit", group: "Environ", icon: Leaf, price: 17000 },
  { id: "nurse", name: "Nurse-Assist", group: "Care", icon: HeartPulse, price: 20000 },
  { id: "bridge", name: "Bridge-Bot", group: "Care", icon: Plug, price: 18000 },
  { id: "vital", name: "Vital-View", group: "Care", icon: BarChart3, price: 22000 },
  { id: "claim", name: "Claim-Guard", group: "Care", icon: ShieldCheck, price: 19000 },
];

const groupColor: Record<string, string> = {
  Nexus: "var(--nexus)", Environ: "var(--environ)", Care: "var(--care)",
};

function CustomBuild() {
  const [picked, setPicked] = useState<string[]>(["pulse", "permit"]);
  const [hosting, setHosting] = useState<"cloud" | "onprem">("cloud");

  const toggle = (id: string) => setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const totals = useMemo(() => {
    const base = catalog.filter((c) => picked.includes(c.id)).reduce((s, x) => s + x.price, 0);
    const retainer = Math.round(base * (hosting === "onprem" ? 1.3 : 1));
    const setup = Math.round(retainer * 3.2);
    return { retainer, setup };
  }, [picked, hosting]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Your custom build is on its way to our solutions team.");
  };

  return (
    <>
      <section className="relative pt-20 pb-12">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" />
        <div className="relative mx-auto max-w-5xl px-5 text-center">
          <div className="font-display text-xs tracking-[0.32em] text-primary">CUSTOM BUILD</div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Compose your <span className="text-gradient-brand">private module</span>.</h1>
          <p className="mt-5 text-muted-foreground max-w-2xl mx-auto">Pick the sub-modules that match your floor. We'll stitch them into a single deployment with one onboarding, one retainer, and one dashboard.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {(["Nexus", "Environ", "Care"] as const).map((g) => (
              <div key={g} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-2 w-2 rounded-full" style={{ background: groupColor[g] }} />
                  <h2 className="font-display tracking-[0.28em] text-sm">{g.toUpperCase()}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {catalog.filter((c) => c.group === g).map((c) => {
                    const on = picked.includes(c.id);
                    return (
                      <motion.button
                        key={c.id}
                        onClick={() => toggle(c.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`text-left rounded-2xl border p-4 transition-all ${on ? "border-primary bg-primary/5 shadow-brand" : "border-border bg-card hover:border-primary/40"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: groupColor[g] }}>
                            <c.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-display tracking-wider">{c.name}</div>
                              <div className={`h-5 w-5 rounded-full border grid place-items-center ${on ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}>
                                {on && <Check className="h-3 w-3" />}
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">{fmt(c.price)} / mo</div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-6">
              <h2 className="font-display tracking-[0.28em] text-sm mb-3">HOSTING</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {([
                  { v: "cloud", icon: Cloud, name: "Cloud", desc: "Managed by Mushai. Fastest onboarding." },
                  { v: "onprem", icon: ShieldCheck, name: "On-Premise", desc: "Air-gapped. +30% retainer." },
                ] as const).map((o) => {
                  const on = hosting === o.v;
                  return (
                    <button key={o.v} onClick={() => setHosting(o.v)}
                      className={`text-left rounded-2xl border p-4 transition-all ${on ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
                      <o.icon className="h-5 w-5 text-primary" />
                      <div className="mt-3 font-medium">{o.name}</div>
                      <div className="text-xs text-muted-foreground">{o.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-7 shadow-elegant">
              <div className="font-display text-xs tracking-[0.32em] text-primary">YOUR BUILD</div>
              <h3 className="mt-2 text-2xl font-semibold">{picked.length} sub-modules selected</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-surface-2 p-4">
                  <div className="text-[10px] font-display tracking-[0.28em] text-muted-foreground">SETUP</div>
                  <motion.div key={totals.setup} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-1 font-display text-xl">{fmt(totals.setup)}</motion.div>
                </div>
                <div className="rounded-2xl bg-surface-2 p-4">
                  <div className="text-[10px] font-display tracking-[0.28em] text-muted-foreground">RETAINER / MO</div>
                  <motion.div key={totals.retainer} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-1 font-display text-xl">{fmt(totals.retainer)}</motion.div>
                </div>
              </div>

              <form onSubmit={submit} className="mt-6 space-y-3">
                <div className="space-y-1.5"><Label className="text-xs">Work email</Label><Input required type="email" placeholder="you@company.com" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Company</Label><Input required placeholder="Acme Industries" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Anything we should know?</Label><Textarea rows={3} placeholder="Sites, integrations, timeline…" /></div>
                <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90">Request this build<ArrowRight className="ml-1 h-4 w-4" /></Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
