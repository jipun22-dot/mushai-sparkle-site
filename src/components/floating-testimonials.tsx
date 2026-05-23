import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  { quote: "Cut our shift-end reporting from 90 minutes to 4. Floor managers finally trust the data.", name: "Rakesh Iyer", role: "VP Operations · Steel Manufacturing", color: "nexus" },
  { quote: "Permit-Check killed our audit backlog. EHS team runs leaner and never misses a renewal.", name: "Priya Menon", role: "Head of EHS · Petrochemicals", color: "environ" },
  { quote: "Two nurses' worth of capacity unlocked across our wards without a single new hire.", name: "Dr. Anand Verma", role: "Medical Director · Multi-spec Hospital", color: "care" },
  { quote: "ROI in 11 weeks. The retainer pays for itself five times over.", name: "Sunil Kapoor", role: "CFO · Auto Components", color: "nexus" },
  { quote: "Discharge claim leakage dropped 38%. Claim-Guard alone justified the contract.", name: "Neha Bansal", role: "Revenue Cycle Lead · Hospital Group", color: "care" },
  { quote: "First system our floor team actually adopted. The OCR feels like magic.", name: "Imran Sheikh", role: "Plant Head · Textiles", color: "nexus" },
] as const;

const colorMap = { nexus: "var(--nexus)", environ: "var(--environ)", care: "var(--care)" } as const;

export function FloatingTestimonials() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">
          <div className="font-display text-xs tracking-[0.32em] text-primary">VOICES FROM THE FLOOR</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Trusted where downtime is unforgivable.</h2>
        </div>
      </div>
      <div className="relative mt-14 h-[460px] md:h-[420px] overflow-hidden">
        <div className="absolute inset-0 flex gap-6 animate-marquee">
          {[...testimonials, ...testimonials].map((t, i) => (
            <motion.article
              key={i}
              initial={{ y: i % 2 ? -8 : 8 }}
              animate={{ y: i % 2 ? 8 : -8 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 + (i % 3), ease: "easeInOut" }}
              className="relative shrink-0 w-[340px] md:w-[400px] rounded-3xl border border-border bg-card/80 backdrop-blur p-7 shadow-elegant"
              style={{ marginTop: i % 3 === 0 ? 0 : i % 3 === 1 ? 28 : 56 }}
            >
              <div
                className="absolute -top-3 -left-3 grid h-10 w-10 place-items-center rounded-2xl text-white shadow-brand"
                style={{ background: colorMap[t.color] as string }}
              >
                <Quote className="h-4 w-4" />
              </div>
              <p className="text-[15px] leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/40" />
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
