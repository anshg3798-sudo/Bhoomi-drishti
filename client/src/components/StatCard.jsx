export default function StatCard({ label, value, unit, sublabel, accent = "text-[var(--color-text)]", icon: Icon }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--color-text-muted)]">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-[var(--color-text-faint)]" />}
      </div>
      <p className={`data-figure mt-2 text-2xl font-semibold ${accent}`}>
        {value} {unit && <span className="text-sm font-normal text-[var(--color-text-faint)]">{unit}</span>}
      </p>
      {sublabel && <p className="mt-1 text-[11px] text-[var(--color-text-faint)]">{sublabel}</p>}
    </div>
  );
}
