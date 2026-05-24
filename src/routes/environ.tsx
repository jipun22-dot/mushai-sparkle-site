import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2, ShieldCheck, NotebookPen, Leaf } from "lucide-react";
import { ModulePage } from "@/components/module-page";
import { EnvironDashboard } from "@/components/dashboards/environ-dashboard";
import character from "@/assets/character-environ.jpg";

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
      character={character}
      pitch="One missed permit, one expired extinguisher, one un-reconciled fuel receipt — each one a ₹5L fine waiting. Environ stops them at the source and turns your EHS team into a forward-looking sustainability function."
      features={[
        {
          name: "Permit-Check",
          icon: FileCheck2,
          desc: "Scans paper Work-at-Height, Hot-Work, and Confined-Space permits at the site.",
          longDesc: "Captures permit details, validity windows, signatories, and isolation checklists at the moment of issue. Sends countdown alerts before expiry and blocks closure until every JSA item is reconciled.",
          bullets: ["Permit OCR at point-of-issue", "Auto countdown + escalation", "Digital JSA reconciliation", "Closure-block on open items"],
          stat: { value: "0", label: "Expired permits on floor" },
        },
        {
          name: "Cert-Watch",
          icon: ShieldCheck,
          desc: "Scans physical expiry dates on extinguishers, lifting gear, and machinery.",
          longDesc: "A field tech walks the plant and photographs equipment tags. Mushai extracts asset ID, last service date, and expiry — then schedules renewals and routes them to the responsible vendor automatically.",
          bullets: ["Tag-photo asset registry", "Service-due scheduling", "Vendor routing", "Heat-map of cert risk"],
          stat: { value: "−68%", label: "Audit prep time" },
        },
        {
          name: "Log-Vision",
          icon: NotebookPen,
          desc: "Digitizes handwritten safety observation booklets from the floor.",
          longDesc: "Every supervisor's pocket booklet becomes a structured database. Mushai categorizes near-misses, PPE breaches, and spills by zone — and trends them against your safety pyramid.",
          bullets: ["Handwriting + sketch OCR", "Near-miss categorization", "Zone-level safety pyramid", "Weekly trend alerts"],
          stat: { value: "+34%", label: "Reported near-misses" },
        },
        {
          name: "Eco-Audit",
          icon: Leaf,
          desc: "Scans fuel & waste receipts to calculate the factory's carbon footprint.",
          longDesc: "Captures diesel chits, electricity bills, and waste manifests. Converts each to tCO₂e using updated India-grid factors and rolls them into a board-ready ESG report — automatically.",
          bullets: ["Receipt + manifest OCR", "India-grid tCO₂e math", "Scope 1 / 2 / 3 split", "Board-ready ESG export"],
          stat: { value: "−6.4%", label: "MoM emission load" },
        },
      ]}
      proof={[
        { stat: "−68%", label: "Audit prep" },
        { stat: "₹5L", label: "Avg fine mitigated" },
        { stat: "0", label: "Missed renewals" },
        { stat: "6.4%", label: "Carbon reduction" },
      ]}
      dashboard={<EnvironDashboard />}
    />
  );
}
