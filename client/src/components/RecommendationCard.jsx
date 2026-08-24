import { useTranslation } from "react-i18next";
import { CheckCircle2, Sparkles, BookOpen } from "lucide-react";

const PRIORITY_STYLE = {
  High: "text-[var(--color-red)] bg-[var(--color-red-soft)]",
  Moderate: "text-[var(--color-amber)] bg-[var(--color-amber-soft)]",
  Low: "text-[var(--color-green)] bg-[var(--color-green-soft)]"
};
const PRIORITY_BORDER = {
  High: "border-l-[var(--color-red)]",
  Moderate: "border-l-[var(--color-amber)]",
  Low: "border-l-[var(--color-green)]"
};

export function RecommendationCard({ rec }) {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 border-l-4 ${
        PRIORITY_BORDER[rec.priority] || "border-l-[var(--color-border)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-green)]" />
          <div>
            <p className="text-sm font-semibold">{rec.title}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-[var(--color-text-faint)]">{rec.category}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLE[rec.priority] || ""}`}>
          {t(`risk.${rec.priority}`, rec.priority)} {t("recommendationCard.priority")}
        </span>
      </div>

      <p className="mt-3 text-xs text-[var(--color-text-muted)]"><span className="text-[var(--color-text-faint)]">{t("recommendationCard.reason")} </span>{rec.reason}</p>
      <p className="mt-1.5 text-xs text-[var(--color-text-muted)]"><span className="text-[var(--color-text-faint)]">{t("recommendationCard.expectedImpact")} </span>{rec.expectedImpact}</p>

      <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border-soft)] pt-2.5">
        <span className="text-[11px] text-[var(--color-text-faint)]">{t("recommendationCard.expectedReduction")}</span>
        <span className="data-figure text-sm font-semibold text-[var(--color-green)]">{rec.expectedSoilLossReduction}</span>
      </div>
    </div>
  );
}

export function ExplanationPanel({ explanation }) {
  if (!explanation) return null;
  const isAI = explanation.mode === "AI";
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold">
        {isAI ? <Sparkles className="h-3.5 w-3.5 text-[var(--color-green)]" /> : <BookOpen className="h-3.5 w-3.5 text-[var(--color-amber)]" />}
        <span>{explanation.label}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{explanation.explanation}</p>
    </div>
  );
}