import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { LeadForm } from "@/components/lead-form";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mushai Systems" },
      { name: "description", content: "Talk to Mushai Systems about a pilot, custom build, or partnership." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" />
      <div className="relative mx-auto max-w-6xl px-5 grid gap-12 lg:grid-cols-2 items-start">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div className="font-display text-xs tracking-[0.32em] text-primary">LET'S TALK</div>
          <h1 className="mt-4 font-display text-5xl md:text-6xl tracking-tight">Tell us where the <span className="text-gradient-brand">friction is</span>.</h1>
          <p className="mt-5 text-muted-foreground max-w-lg">We respond in under 24 hours with a tailored module breakdown and a pilot proposal scoped to your operation.</p>
          <div className="mt-10 space-y-5">
            {[
              { icon: Mail, label: "hello@mushai.systems" },
              { icon: Phone, label: "+91 80 4567 8900" },
              { icon: MapPin, label: "Bengaluru · India" },
            ].map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary"><c.icon className="h-4 w-4" /></div>
                <div className="text-sm">{c.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          <LeadForm />
        </motion.div>
      </div>
    </section>
  );
}
