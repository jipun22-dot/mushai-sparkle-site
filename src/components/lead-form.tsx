import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
    toast.success("Got it. Our team will reach out within one business day.");
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-border bg-card p-10 text-center shadow-elegant">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-4 text-2xl font-semibold">Request received.</h3>
        <p className="mt-2 text-muted-foreground">A Mushai solutions engineer will reach out within one business day with a tailored walkthrough.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className={`rounded-3xl border border-border bg-card ${compact ? "p-6" : "p-8"} shadow-elegant`}>
      {!compact && (
        <>
          <div className="font-display text-xs tracking-[0.32em] text-primary">START THE CONVERSATION</div>
          <h3 className="mt-3 text-2xl font-semibold">Tell us where the friction is.</h3>
          <p className="mt-2 text-sm text-muted-foreground">We respond in under 24 hours with a tailored module breakdown.</p>
        </>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><Input required placeholder="Asha Krishnan" /></Field>
        <Field label="Work email"><Input required type="email" placeholder="asha@factory.com" /></Field>
        <Field label="Company"><Input required placeholder="Acme Industries" /></Field>
        <Field label="Industry">
          <Select defaultValue="manufacturing">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="petrochemicals">Petrochemicals / EHS</SelectItem>
              <SelectItem value="healthcare">Hospital / Healthcare</SelectItem>
              <SelectItem value="logistics">Logistics / Warehousing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Where is the bottleneck?">
            <Textarea rows={4} placeholder="e.g. End-of-shift reporting takes 90 mins and our floor data never matches ERP." />
          </Field>
        </div>
      </div>
      <Button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-primary hover:bg-primary/90 group">
        {loading ? "Sending…" : "Book a 20-min walkthrough"}
        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">By submitting you agree to be contacted by Mushai Systems. No spam — ever.</p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
