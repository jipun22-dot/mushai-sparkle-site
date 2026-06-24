import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, X, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "./logo";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/nexus", label: "Nexus" },
  { to: "/environ", label: "Environ" },
  { to: "/care", label: "Care" },
  { to: "/custom-build", label: "Custom Build" },
  { to: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "glass border-b border-border" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="shrink-0"><Logo /></Link>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link key={n.to} to={n.to}
              className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors data-[status=active]:text-foreground data-[status=active]:font-medium"
              activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
          {user && (
            <Link to="/dashboard"
              className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors data-[status=active]:text-foreground data-[status=active]:font-medium">
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-accent transition-colors">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="hidden sm:block">
                <Button size="sm" variant="outline" className="rounded-full"><LayoutDashboard className="h-3.5 w-3.5 mr-1.5" /> Dashboard</Button>
              </Link>
              <button onClick={signOut} className="hidden sm:grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-accent" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="hidden sm:block">
              <Button size="sm" variant="outline" className="rounded-full"><LogIn className="h-3.5 w-3.5 mr-1.5" /> Sign in</Button>
            </Link>
          )}
          <Link to="/contact" className="hidden sm:block">
            <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90">Book demo</Button>
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden grid h-9 w-9 place-items-center rounded-full border border-border">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden glass border-t border-border">
          <div className="flex flex-col px-5 py-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2.5 text-sm">{n.label}</Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="py-2.5 text-sm">Dashboard</Link>
                <button onClick={() => { signOut(); setOpen(false); }} className="py-2.5 text-sm text-left">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="py-2.5 text-sm">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
