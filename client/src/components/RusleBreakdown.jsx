import { useTranslation } from "react-i18next";
import { riskColor } from "./Badges";

export default function RusleBreakdown({ rusle }) {
  const { t } = useTranslation();
  if (!rusle) return null;
  const c = riskColor(rusle.riskCategory);

  const FACTOR_LABELS = {
    R: t("rusle.factorR"),
    K: t("rusle.factorK"),
    LS: t("rusle.factorLS"),
    C: t("rusle.factorC"),
    P: t("rusle.factorP")
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-[var(--font-display)] text-sm font-semibold">{t("rusle.title")}</h3>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${c.text} ${c.bg}`}>{t(`risk.${rusle.riskCategory}`, rusle.riskCategory)}</span>
      </div>
      <p className="mt-1 text-[11px] text-[var(--color-text-faint)]">{t("rusle.formulaNote")}</p>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {Object.entries(rusle.factors).map(([key, value]) => (
          <div key={key} className="rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] p-2.5 text-center">
            <p className="data-figure text-lg font-semibold">{value}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-[var(--color-text-faint)]">{key}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-[var(--color-surface-2)] px-3 py-2.5">
        <p className="data-figure text-center text-sm text-[var(--color-text-muted)]">{rusle.breakdown}</p>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-xs text-[var(--color-text-faint)]">{t("rusle.estimatedSoilLoss")}</span>
        <span className="data-figure text-xl font-semibold">{rusle.soilLoss} <span className="text-xs font-normal text-[var(--color-text-faint)]">t/ha/year</span></span>
      </div>

      <div className="mt-3 space-y-1 border-t border-[var(--color-border-soft)] pt-3">
        {Object.entries(rusle.factors).map(([key, value]) => (
          <div key={key} className="flex justify-between text-[11px]">
            <span className="text-[var(--color-text-faint)]">{FACTOR_LABELS[key]}</span>
            <span className="data-figure text-[var(--color-text-muted)]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}