import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-border bg-surface-2">
      <div className="absolute inset-x-0 bottom-0 h-32 wave-lines pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">
            Automate. Integrate. Elevate. Mushai Systems digitizes the physical world — from shop floors to hospital wards.
          </p>
        </div>
        <div>
          <div className="font-display text-xs tracking-[0.25em] text-muted-foreground mb-4">MODULES</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/nexus" className="hover:text-primary">Nexus — Manufacturing</Link></li>
            <li><Link to="/environ" className="hover:text-primary">Environ — EHS</Link></li>
            <li><Link to="/care" className="hover:text-primary">Care — Healthcare</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-display text-xs tracking-[0.25em] text-muted-foreground mb-4">COMPANY</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link to="/custom-build" className="hover:text-primary">Custom Build</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Mushai Systems. All rights reserved.</div>
          <div className="font-display tracking-[0.32em]">AUTOMATE · INTEGRATE · ELEVATE</div>
        </div>
      </div>
    </footer>
  );
}
