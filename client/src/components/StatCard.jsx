export default function StatCard({ label, value, unit, sublabel, accent = "text-[var(--color-text)]", icon: Icon }) {
  const stripeColor = accent.replace("text-", "bg-");
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="eyebrow">{label}</p>
          {Icon && <Icon className="h-4 w-4 text-[var(--color-text-faint)]" />}
        </div>
        <p className={`data-figure mt-2.5 text-2xl font-semibold ${accent}`}>
          {value} {unit && <span className="text-sm font-normal text-[var(--color-text-faint)]">{unit}</span>}
        </p>
        {sublabel && <p className="mt-1 text-[11px] text-[var(--color-text-faint)]">{sublabel}</p>}
      </div>
      {/* core-reading stripe: this card's own accent color, like a single soil-horizon band */}
      <div className={`h-[3px] w-full ${stripeColor}`} />
    </div>
  );
}