import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2, ShieldCheck, NotebookPen, Leaf } from "lucide-react";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/environ")({
  head: () => ({
    meta: [
      { title: "Environ — EHS & Sustainability · Mushai Systems" },
      { name: "description", content: "Digitize permits, certifications, safety observations, and carbon footprint — Mushai Environ." },
    ],
  }),
  component: EnvironPage,
});

function EnvironPage() {
  return (
    <ModulePage
      slug="Environ"
      name="ENVIRON"
      tagline="For EHS & sustainability."
      description="Track permits, audits, certifications, safety observations, and the carbon load — without the paper backlog. Audit-ready, every hour."
      accent="environ"
      variant="industrial"
      features={[
        { name: "Permit-Check", desc: "Scans 'Work at Height' or 'Hot Work' paper permits at the site.", icon: FileCheck2 },
        { name: "Cert-Watch", desc: "Scans the physical expiry dates on fire extinguishers and machinery.", icon: ShieldCheck },
        { name: "Log-Vision", desc: "Digitizes handwritten 'Safety Observation' booklets from the floor.", icon: NotebookPen },
        { name: "Eco-Audit", desc: "Scans fuel & waste receipts to calculate the factory's carbon footprint.", icon: Leaf },
      ]}
      kpis={[
        { label: "Permits active", value: "146", delta: "12 expiring < 7d", tone: "warn" },
        { label: "Safety obs (today)", value: "84", delta: "+19 vs avg", tone: "up" },
        { label: "Audit-ready zones", value: "94%", delta: "Zone D pending", tone: "warn" },
        { label: "Carbon footprint", value: "182t", delta: "−6.4% MoM", tone: "up" },
      ]}
      trendName="Emission load (tCO₂) — last 8 weeks"
      trendData={[
        { t: "W1", v: 210 }, { t: "W2", v: 205 }, { t: "W3", v: 198 }, { t: "W4", v: 201 },
        { t: "W5", v: 192 }, { t: "W6", v: 188 }, { t: "W7", v: 184 }, { t: "W8", v: 182 },
      ]}
      barName="Open observations by category"
      barData={[
        { t: "PPE", v: 18 }, { t: "Spill", v: 7 }, { t: "Permit", v: 12 }, { t: "Cert", v: 9 }, { t: "Other", v: 14 },
      ]}
      events={[
        { time: "4 min ago · Zone D", text: "Permit-Check flagged expired hot work permit.", tone: "alert" },
        { time: "26 min ago · Tank Farm", text: "Vent emission within range, logged.", tone: "ok" },
        { time: "1 hr ago · Warehouse", text: "Extinguisher #314 expiry in 9 days.", tone: "warn" },
        { time: "3 hr ago · Eco-Audit", text: "Diesel receipts reconciled — ₹2.4L logged.", tone: "ok" },
      ]}
      proof={[
        { stat: "−68%", label: "Audit prep time" },
        { stat: "₹5L", label: "Avg fine mitigated / yr" },
        { stat: "0", label: "Missed cert renewals" },
        { stat: "6.4%", label: "Carbon reduction" },
      ]}
    />
  );
}
