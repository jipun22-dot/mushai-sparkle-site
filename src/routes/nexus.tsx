import { createFileRoute } from "@tanstack/react-router";
import { DoorOpen, Activity, FlaskConical, Users } from "lucide-react";
import { ModulePage } from "@/components/module-page";
import { NexusDashboard } from "@/components/dashboards/nexus-dashboard";
import character from "@/assets/character-nexus.jpg";

export const Route = createFileRoute("/nexus")({
  head: () => ({
    meta: [
      { title: "Nexus — Manufacturing Excellence · Mushai Systems" },
      { name: "description", content: "Real-time digitization of shop floor logs, security, lab, and workforce — Mushai Nexus." },
    ],
  }),
  component: NexusPage,
});

function NexusPage() {
  return (
    <ModulePage
      slug="Nexus"
      name="NEXUS"
      tagline="For manufacturing excellence."
      description="Real-time digitization of shop-floor machine logs, security gates, lab results, and workforce attendance. The control tower for the people who run the plant."
      accent="nexus"
      character={character}
      pitch="If a factory HOD earns ₹1.5L/month and spends 25% on clerical verification, you save ₹37,500 per person — every month. Add a clerk and one mitigated fine, and the ₹65k retainer pays for itself five times over."
      features={[
        {
          name: "Gate-Keep",
          icon: DoorOpen,
          desc: "Automated shift-entry, security logs, and compliance verification at the entry point.",
          longDesc: "Replaces the paper-based gate register with an AI-vision pipeline that captures vehicle plates, badge IDs, and contractor permits in under a second — and reconciles them against shift roster, training expiry, and PPE compliance before the worker steps onto the floor.",
          bullets: ["ANPR + badge OCR", "Shift roster reconciliation", "PPE/training compliance gate", "Visitor & contractor audit trail"],
          stat: { value: "−74%", label: "Gate-to-floor wait time" },
        },
        {
          name: "Floor-Pulse",
          icon: Activity,
          desc: "Real-time digitization of shop-floor machine logs and hourly production charts.",
          longDesc: "Operators photograph the machine HMI or paper hourly chart. Mushai parses production count, downtime reason codes, and operator notes — and streams a structured OEE signal into your ERP before the next shift handover.",
          bullets: ["HMI + paper-chart OCR", "Live OEE & downtime reason codes", "ERP / SAP push", "Shift-end report auto-generation"],
          stat: { value: "−72%", label: "Shift-end reporting time" },
        },
        {
          name: "Lab-Link",
          icon: FlaskConical,
          desc: "Digitization of handwritten lab test results, sample tracking, and reagent logs.",
          longDesc: "Captures handwritten chemical and physical lab test sheets, maps them to sample IDs, and pushes results to LIMS / ERP. Catches out-of-spec readings the moment they're written — not the morning after.",
          bullets: ["Handwritten lab-sheet OCR", "Sample ID + reagent tracking", "Out-of-spec auto-alerts", "LIMS / ERP sync"],
          stat: { value: "12s", label: "Lab sheet → LIMS" },
        },
        {
          name: "Work-Force",
          icon: Users,
          desc: "Digitization of attendance, safety training logs, and on-site workforce certifications.",
          longDesc: "Tracks attendance, safety inductions, and skill certifications for every direct and contract worker. Stops uncertified operators from entering restricted zones — and surfaces expiring credentials 30 days ahead.",
          bullets: ["Attendance + biometric ingest", "Skill / safety cert vault", "Restricted-zone access logic", "30-day expiry early warning"],
          stat: { value: "0", label: "Expired-cert incidents" },
        },
      ]}
      proof={[
        { stat: "11 wks", label: "Average payback" },
        { stat: "−72%", label: "Reporting time" },
        { stat: "5×", label: "Retainer ROI" },
        { stat: "₹37.5K", label: "Saved / HOD / mo" },
      ]}
      dashboard={<NexusDashboard />}
    />
  );
}
