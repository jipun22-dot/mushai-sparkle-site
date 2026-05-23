export function Logo({ className = "", showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden>
        <defs>
          <linearGradient id="ml" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.24 27)" />
            <stop offset="100%" stopColor="oklch(0.45 0.23 27)" />
          </linearGradient>
        </defs>
        <g fill="url(#ml)">
          <rect x="8" y="8" width="14" height="48" rx="7" />
          <rect x="42" y="8" width="14" height="48" rx="7" />
          <rect x="25" y="20" width="14" height="36" rx="7" opacity="0.85" />
          <path d="M15 8 L32 38 L49 8 Z" opacity="0.55" />
        </g>
      </svg>
      {showWord && (
        <div className="leading-none">
          <div className="font-display text-[15px] font-semibold tracking-[0.18em]">MUSHAI</div>
          <div className="font-display text-[9px] tracking-[0.32em] text-muted-foreground mt-0.5">SYSTEMS</div>
        </div>
      )}
    </div>
  );
}
