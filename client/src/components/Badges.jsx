export function riskColor(category) {
  switch (category) {
    case "Very Low": return { text: "text-[var(--color-green)]", bg: "bg-[var(--color-green-soft)]", ring: "ring-[var(--color-green)]/30" };
    case "Low": return { text: "text-[var(--color-green)]", bg: "bg-[var(--color-green-soft)]", ring: "ring-[var(--color-green)]/30" };
    case "Moderate": return { text: "text-[var(--color-amber)]", bg: "bg-[var(--color-amber-soft)]", ring: "ring-[var(--color-amber)]/30" };
    case "High": return { text: "text-[var(--color-clay)]", bg: "bg-[var(--color-clay-soft)]", ring: "ring-[var(--color-clay)]/30" };
    case "Very High": return { text: "text-[var(--color-red)]", bg: "bg-[var(--color-red-soft)]", ring: "ring-[var(--color-red)]/30" };
    case "Critical": return { text: "text-[var(--color-deepred)]", bg: "bg-[var(--color-red-soft)]", ring: "ring-[var(--color-deepred)]/40" };
    default: return { text: "text-[var(--color-text-muted)]", bg: "bg-[var(--color-surface-2)]", ring: "ring-[var(--color-border)]" };
  }
}

export function RiskPill({ category, size = "md" }) {
  const c = riskColor(category);
  const sizeCls = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ring-1 ${c.text} ${c.bg} ${c.ring} ${sizeCls}`}>
      {category}
    </span>
  );
}

export function DataModeBadge({ mode = "DEMO" }) {
  const isLive = mode === "LIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${
        isLive
          ? "border-[var(--color-green)]/40 bg-[var(--color-green-soft)] text-[var(--color-green)]"
          : "border-[var(--color-amber)]/40 bg-[var(--color-amber-soft)] text-[var(--color-amber)]"
      }`}
      title={isLive ? "Live satellite/GEE data" : "Seeded demo environmental dataset"}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isLive ? "bg-[var(--color-green)]" : "bg-[var(--color-amber)]"}`} />
      {isLive ? "Live Satellite Data" : "Demo Data"}
    </span>
  );
}

export function DataSourceLine({ sources }) {
  if (!sources || !sources.length) return null;
  return (
    <p className="text-[11px] text-[var(--color-text-faint)]">
      Data source: <span className="text-[var(--color-text-muted)]">{sources.join(" \u2022 ").replace(/\s*\(demo\)/g, "")}</span>{" "}
      <span className="italic">(source simulation for prototype)</span>
    </p>
  );
}
