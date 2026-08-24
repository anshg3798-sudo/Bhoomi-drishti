import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlayCircle, Loader2 } from "lucide-react";
import AppLayout from "../components/AppLayout";
import RusleBreakdown from "../components/RusleBreakdown";
import { RusleFactorChart, ForecastChart } from "../components/Charts";
import { RecommendationCard, ExplanationPanel } from "../components/RecommendationCard";
import { RiskPill, DataSourceLine } from "../components/Badges";
import { ErrorState } from "../components/States";
import { useRegion } from "../context/RegionContext";
import api from "../api/client";

export default function Analysis() {
  const { t } = useTranslation();
  const { regions, selectedRegionId, setSelectedRegionId } = useRegion();
  const [dateRange, setDateRange] = useState("last-6-seasons");
  const [running, setRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const STAGES = [t("analysis.stage1"), t("analysis.stage2"), t("analysis.stage3"), t("analysis.stage4"), t("analysis.stage5")];

  async function runAnalysis() {
    setRunning(true);
    setError(null);
    setResult(null);
    setStageIndex(0);

    const stageTimer = setInterval(() => {
      setStageIndex((i) => (i < STAGES.length - 1 ? i + 1 : i));
    }, 260);

    try {
      const [{ data: full }] = await Promise.all([
        api.post("/analysis/run", { region: selectedRegionId }),
        new Promise((resolve) => setTimeout(resolve, STAGES.length * 260))
      ]);
      setResult(full);
    } catch (err) {
      setError(err?.response?.data?.message || t("analysis.errorDefault"));
    } finally {
      clearInterval(stageTimer);
      setRunning(false);
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-semibold">{t("analysis.title")}</h1>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">{t("analysis.subtitle")}</p>
        </div>

        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div>
            <label className="mb-1 block text-[11px] text-[var(--color-text-faint)]">{t("analysis.region")}</label>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm"
            >
              {(regions.length ? regions : [{ id: selectedRegionId, name: selectedRegionId }]).map((r) => (
                <option key={r.id} value={r.id}>{r.district || r.name}{r.district ? `, ${r.name}` : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-[var(--color-text-faint)]">{t("analysis.dateRange")}</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm"
            >
              <option value="last-6-seasons">{t("analysis.last6Seasons")}</option>
              <option value="last-year">{t("analysis.last12Months")}</option>
              <option value="last-3-years">{t("analysis.last3Years")}</option>
            </select>
          </div>
          <button
            onClick={runAnalysis}
            disabled={running}
            className="ml-auto flex items-center gap-2 rounded-lg bg-[var(--color-green)] px-5 py-2.5 text-sm font-semibold text-[#fdfcf6] disabled:opacity-60"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
            {t("analysis.runAnalysis")}
          </button>
        </div>

        {running && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-[var(--color-green)]" />
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">{STAGES[stageIndex]}</p>
            <div className="mx-auto mt-4 h-1.5 w-64 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-full bg-[var(--color-green)] transition-all duration-300"
                style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && <ErrorState message={error} />}

        {result && !running && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-[var(--font-display)] text-lg font-semibold">{result.region.name}</h2>
              <RiskPill category={result.rusle.riskCategory} />
              <RiskPill category={result.floodRisk.category} />
              <RiskPill category={result.droughtRisk.category} />
            </div>
            <DataSourceLine sources={result.dataSource} />

            <div className="grid gap-4 lg:grid-cols-2">
              <RusleBreakdown rusle={result.rusle} />
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h3 className="font-[var(--font-display)] text-sm font-semibold">{t("analysis.rusleFactorTitle")}</h3>
                <div className="mt-3"><RusleFactorChart factors={result.rusle.factors} /></div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h3 className="font-[var(--font-display)] text-sm font-semibold">{t("analysis.forecastTitle")}</h3>
                <p className="mt-1 text-[11px] text-[var(--color-text-faint)]">{result.forecast.method}</p>
                <div className="mt-3"><ForecastChart series={result.historicalSeries} forecast={result.forecast} /></div>
                <ul className="mt-3 space-y-1 text-[11px] text-[var(--color-text-faint)]">
                  {result.forecast.contributingFactors.map((f, i) => <li key={i}>&bull; {f}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h3 className="font-[var(--font-display)] text-sm font-semibold">{t("analysis.hydroPriorityTitle")}</h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{result.hydrology.explanation}</p>
                <p className="mt-3 text-[11px] text-[var(--color-text-faint)]">{t("analysis.flowAccumulation")} <span className="text-[var(--color-text-muted)]">{result.hydrology.flowAccumulation}</span></p>
                <p className="mt-4 text-[11px] uppercase tracking-wide text-[var(--color-text-faint)]">{t("analysis.floodRiskFactors")}</p>
                <ul className="mt-1 space-y-1 text-xs text-[var(--color-text-muted)]">
                  {result.floodRisk.reasons.map((r, i) => <li key={i}>&bull; {r}</li>)}
                </ul>
              </div>
            </div>

            <ExplanationPanel explanation={result.aiExplanation} />

            <div>
              <h3 className="font-[var(--font-display)] text-sm font-semibold">{t("analysis.conservationTitle")}</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {result.recommendations.map((rec, i) => <RecommendationCard key={i} rec={rec} />)}
              </div>
            </div>
          </div>
        )}

        {!result && !running && !error && (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] py-14 text-center text-sm text-[var(--color-text-faint)]">
            {t("analysis.emptyPrompt")}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
