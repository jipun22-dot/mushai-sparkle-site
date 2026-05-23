import { createFileRoute } from "@tanstack/react-router";
import { DoorOpen, Activity, FlaskConical, Users } from "lucide-react";
import { ModulePage } from "@/components/module-page";

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
      variant="factory"
      features={[
        { name: "Gate-Keep", desc: "Automated shift-entry, security logs, and compliance verification at the entry point.", icon: DoorOpen },
        { name: "Floor-Pulse", desc: "Real-time digitization of shop-floor machine logs and hourly production charts.", icon: Activity },
        { name: "Lab-Link", desc: "Digitization of handwritten lab test results, sample tracking, and reagent logs.", icon: FlaskConical },
        { name: "Work-Force", desc: "Digitization of attendance, safety training logs, and on-site workforce certifications.", icon: Users },
      ]}
      kpis={[
        { label: "OEE today", value: "82.4%", delta: "+6.1% vs last week", tone: "up" },
        { label: "Shift reports auto-closed", value: "37 / 42", delta: "5 pending review", tone: "warn" },
        { label: "Unplanned stops", value: "3", delta: "−4 vs avg", tone: "up" },
        { label: "Comp certs valid", value: "98.2%", delta: "12 expiring < 30d", tone: "warn" },
      ]}
      trendName="Floor-Pulse · OEE last 24h"
      trendData={[
        { t: "00", v: 71 }, { t: "03", v: 68 }, { t: "06", v: 75 }, { t: "09", v: 82 },
        { t: "12", v: 79 }, { t: "15", v: 86 }, { t: "18", v: 84 }, { t: "21", v: 81 },
      ]}
      barName="Production by line (units)"
      barData={[
        { t: "L1", v: 412 }, { t: "L2", v: 388 }, { t: "L3", v: 461 }, { t: "L4", v: 297 }, { t: "L5", v: 502 },
      ]}
      events={[
        { time: "12 min ago · Line 2", text: "Floor-Pulse detected idle spike, supervisor pinged.", tone: "alert" },
        { time: "38 min ago · Gate 1", text: "Shift-B entry roster auto-reconciled.", tone: "ok" },
        { time: "1 hr ago · Lab 3", text: "Sample LAB-2244 OCR'd into LIMS.", tone: "ok" },
        { time: "2 hr ago · Press bay", text: "Cert renewal pending — 4 operators.", tone: "warn" },
      ]}
      proof={[
        { stat: "11 wks", label: "Average payback" },
        { stat: "−72%", label: "Shift-end reporting time" },
        { stat: "5×", label: "Retainer ROI" },
        { stat: "₹37.5K", label: "Saved per HOD / mo" },
      ]}
    />
  );
}
