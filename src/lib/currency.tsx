import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Currency = "INR" | "USD" | "AED";

type CurrencyCtx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const Ctx = createContext<CurrencyCtx>({ currency: "INR", setCurrency: () => {} });

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mushai-currency") as Currency | null;
      if (saved === "INR" || saved === "USD" || saved === "AED") setCurrencyState(saved);
    } catch {}
  }, []);
  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try { localStorage.setItem("mushai-currency", c); } catch {}
  };
  return <Ctx.Provider value={{ currency, setCurrency }}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  return useContext(Ctx);
}

const localeMap: Record<Currency, string> = { INR: "en-IN", USD: "en-US", AED: "en-AE" };

export function formatMoney(amount: number, currency: Currency, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(localeMap[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...opts,
  }).format(amount);
}

export function CurrencySwitch({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const opts: Currency[] = ["INR", "USD", "AED"];
  return (
    <div className={`inline-flex p-1 rounded-full border border-border bg-card ${className}`}>
      {opts.map((c) => {
        const active = c === currency;
        return (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-3 py-1 rounded-full text-[11px] font-display tracking-[0.18em] transition-colors ${
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
