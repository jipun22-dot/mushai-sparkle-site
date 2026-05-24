import { createFileRoute } from "@tanstack/react-router";
import { ClipboardPlus, Bot, Activity, ShieldAlert } from "lucide-react";
import { ModulePage } from "@/components/module-page";
import { CareDashboard } from "@/components/dashboards/care-dashboard";
import character from "@/assets/character-care.jpg";

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
      character={character}
      pitch="Save 2 hours per nurse across 3 shifts and you've added 2 nurses to the floor — without hiring anyone. That's ₹60,000/month in latent labor, plus a system that prevents the ₹10–50L medical-negligence event."
      features={[
        {
          name: "Nurse-Assist",
          icon: ClipboardPlus,
          desc: "Scans handwritten vitals, medication slips, and bedside observations.",
          longDesc: "Nurses photograph the vitals chart at the end of every round. Mushai OCRs HR, BP, SpO₂, temp, and free-text notes — and ships them to the HIS, freeing 2+ hours per nurse per shift.",
          bullets: ["Vitals + medication OCR", "Handwriting nuance trained on Indian charts", "HIS push", "Audit trail per entry"],
          stat: { value: "2 hr", label: "Per nurse · per shift" },
        },
        {
          name: "Bridge-Bot",
          icon: Bot,
          desc: "Automatically types OCR'd data into the hospital's legacy ERP / HIS.",
          longDesc: "Most hospital systems were never built for API integration. Bridge-Bot mimics human keystrokes — auto-populating ICU charts, billing screens, and discharge summaries on legacy UIs with zero IT change request.",
          bullets: ["RPA on legacy HIS UI", "Zero-API integration", "Field-validation guardrails", "Full keystroke audit log"],
          stat: { value: "0", label: "IT change requests" },
        },
        {
          name: "Vital-View",
          icon: Activity,
          desc: "Real-time trend analysis and Early Warning Score alerts for senior doctors.",
          longDesc: "Continuously scores every active patient with NEWS2 / MEWS, surfaces drift before deterioration, and pings the on-call senior the moment the threshold is crossed — even if the nurse hasn't escalated.",
          bullets: ["NEWS2 / MEWS scoring", "Drift detection", "Senior on-call escalation", "Bedside mobile alerts"],
          stat: { value: "−41%", label: "Code-blue events" },
        },
        {
          name: "Claim-Guard",
          icon: ShieldAlert,
          desc: "Scans discharge summaries vs. billable medicines and procedures.",
          longDesc: "Before the patient walks out, Claim-Guard reconciles every billable line item against the discharge summary, prescription, and procedure log. Stops insurance-rejection leakage at the source.",
          bullets: ["Line-item reconciliation", "Insurance T&C engine", "Pre-discharge flag", "Revenue-cycle dashboard"],
          stat: { value: "−38%", label: "Claim leakage" },
        },
      ]}
      proof={[
        { stat: "2 hr", label: "Saved / nurse / shift" },
        { stat: "₹60K", label: "Latent labor / mo" },
        { stat: "−38%", label: "Claim leakage" },
        { stat: "₹15L", label: "Annual retainer" },
      ]}
      dashboard={<CareDashboard />}
    />
  );
}
