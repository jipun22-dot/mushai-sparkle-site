import { createFileRoute } from "@tanstack/react-router";
import { ClipboardPlus, Bot, Activity, ShieldAlert } from "lucide-react";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "Care — Healthcare Accuracy · Mushai Systems" },
      { name: "description", content: "Digitize nursing vitals, ERP entry, early warning, and claim reconciliation — Mushai Care." },
    ],
  }),
  component: CarePage,
});

function CarePage() {
  return (
    <ModulePage
      slug="Care"
      name="CARE"
      tagline="For healthcare accuracy."
      description="Eliminate clerical drag at the bedside. Vitals digitized, ERP entries automated, early warnings surfaced, and claim leakage stopped before discharge."
      accent="care"
      variant="ward"
      features={[
        { name: "Nurse-Assist", desc: "Scans handwritten vitals, medication slips, and bedside observations.", icon: ClipboardPlus },
        { name: "Bridge-Bot", desc: "Automatically types the OCR data into the hospital's legacy ERP / HIS.", icon: Bot },
        { name: "Vital-View", desc: "Real-time trend analysis and 'Early Warning' alerts for senior doctors.", icon: Activity },
        { name: "Claim-Guard", desc: "Scans discharge summaries vs. billable medicines and procedures.", icon: ShieldAlert },
      ]}
      kpis={[
        { label: "Charts auto-entered", value: "1,284", delta: "+312 vs yesterday", tone: "up" },
        { label: "Early warnings", value: "7", delta: "2 escalated", tone: "warn" },
        { label: "Claim leakage stopped", value: "₹3.2L", delta: "this week", tone: "up" },
        { label: "Nurse hrs recovered", value: "62h", delta: "= 2 FTEs", tone: "up" },
      ]}
      trendName="Vital-View · risk score trend"
      trendData={[
        { t: "06", v: 22 }, { t: "08", v: 31 }, { t: "10", v: 28 }, { t: "12", v: 44 },
        { t: "14", v: 38 }, { t: "16", v: 29 }, { t: "18", v: 35 }, { t: "20", v: 26 },
      ]}
      barName="Claim variance by department (₹k)"
      barData={[
        { t: "ICU", v: 142 }, { t: "Ortho", v: 88 }, { t: "Cardio", v: 119 }, { t: "Onco", v: 73 }, { t: "ER", v: 96 },
      ]}
      events={[
        { time: "2 min ago · ICU bay 3", text: "Vital-View flagged tachycardia trend — senior pinged.", tone: "alert" },
        { time: "14 min ago · Ward 5", text: "Bridge-Bot synced 42 vitals into HIS.", tone: "ok" },
        { time: "33 min ago · Discharge desk", text: "Claim-Guard caught missing imaging line item.", tone: "warn" },
        { time: "1 hr ago · Ward 2", text: "Nurse-Assist OCR'd shift notebook — 28 entries.", tone: "ok" },
      ]}
      proof={[
        { stat: "2 hrs", label: "Saved per nurse / shift" },
        { stat: "₹60K", label: "Latent labor / mo" },
        { stat: "−38%", label: "Discharge claim leakage" },
        { stat: "₹15L", label: "Annual retainer" },
      ]}
    />
  );
}
