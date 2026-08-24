import { Droplets, Sun, Leaf, Layers, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import MapView from "../components/MapView";
import RusleBreakdown from "../components/RusleBreakdown";
import { RainfallNdviChart, ForecastChart } from "../components/Charts";
import { RecommendationCard, ExplanationPanel } from "../components/RecommendationCard";
import { LoadingState, ErrorState } from "../components/States";
import { DataSourceLine } from "../components/Badges";
import { useRegion } from "../context/RegionContext";
import { useAnalysis } from "../hooks/useAnalysis";
import { usePriorityZones } from "../hooks/usePriorityZones";

export default function Dashboard() {
  const { t } = useTranslation();
  const { selectedRegionId, setSelectedRegionId } = useRegion();
  const { data, loading, error } = useAnalysis(selectedRegionId);
  const { zones } = usePriorityZones();

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        <div>
          <p className="eyebrow">
            {data ? `${data.region.name} \u2022 ${data.region.district}` : t("dashboard.loadingRegion")}
          </p>
          <h1 className="display-hero mt-1 text-2xl">{t("dashboard.title")}</h1>
        </div>

        {error && <ErrorState message={error} />}
        {loading && !data && <LoadingState label={t("dashboard.acquiringData")} />}

        {data && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard label={t("dashboard.statSoilLoss")} value={data.rusle.soilLoss} unit="t/ha/yr" sublabel={t("dashboard.statSoilLossSub")} accent="text-[var(--color-clay)]" icon={Layers} />
              <StatCard label={t("dashboard.statErosionRisk")} value={data.rusle.riskCategory} sublabel={t("dashboard.statErosionRiskSub")} accent="text-[var(--color-clay)]" icon={AlertTriangle} />
              <StatCard label={t("dashboard.statFloodRisk")} value={data.floodRisk.category} sublabel={t("dashboard.statFloodRiskSub")} accent="text-[var(--color-blue)]" icon={Droplets} />
              <StatCard label={t("dashboard.statDroughtRisk")} value={data.droughtRisk.category} sublabel={t("dashboard.statDroughtRiskSub")} accent="text-[var(--color-amber)]" icon={Sun} />
              <StatCard label={t("dashboard.statVegHealth")} value={data.ndvi} unit="NDVI" sublabel={t("dashboard.statVegHealthSub")} accent="text-[var(--color-green)]" icon={Leaf} />
              <StatCard label={t("dashboard.statPriority")} value={zones.find((z) => z.id === selectedRegionId)?.priority || "\u2014"} sublabel={t("dashboard.statPrioritySub")} />
            </div>

            {/* Map */}
            <MapView
              zones={zones}
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              hydrology={data.hydrology}
              height="480px"
            />
            <DataSourceLine sources={data.dataSource} />

            {/* Trends + Forecast */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h3 className="font-[var(--font-display)] text-sm font-semibold">{t("dashboard.rainfallNdviTitle")}</h3>
                <p className="mt-1 text-[11px] text-[var(--color-text-faint)]">{t("dashboard.rainfallNdviSub")}</p>
                <div className="mt-3"><RainfallNdviChart series={data.historicalSeries} /></div>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-[var(--font-display)] text-sm font-semibold">{t("dashboard.forecastTitle")}</h3>
                  <span className="data-figure text-[11px] text-[var(--color-text-faint)]">{t("dashboard.forecastConfidence")} {data.forecast.confidence}%</span>
                </div>
                <p className="mt-1 text-[11px] text-[var(--color-text-faint)]">{t("dashboard.forecastSub")}</p>
                <div className="mt-3"><ForecastChart series={data.historicalSeries} forecast={data.forecast} /></div>
              </div>
            </div>

            {/* RUSLE + Recommendations */}
            <div className="grid gap-4 lg:grid-cols-2">
              <RusleBreakdown rusle={data.rusle} />
              <div className="space-y-4">
                <ExplanationPanel explanation={data.aiExplanation} />
                {data.recommendations.slice(0, 2).map((rec, i) => <RecommendationCard key={i} rec={rec} />)}
              </div>
            </div>

            <p className="text-center text-[11px] text-[var(--color-text-faint)]">
              {t("dashboard.lastUpdated")} {new Date(data.lastUpdated).toLocaleString()} &middot; {t("dashboard.confidenceNote")}
            </p>
          </>
        )}
      </div>
    </AppLayout>
  );
}