import AppLayout from "../components/AppLayout";
import { RecommendationCard, ExplanationPanel } from "../components/RecommendationCard";
import { LoadingState, ErrorState } from "../components/States";
import { useRegion } from "../context/RegionContext";
import { useAnalysis } from "../hooks/useAnalysis";

export default function Recommendations() {
  const { regions, selectedRegionId, setSelectedRegionId } = useRegion();
  const { data, loading, error } = useAnalysis(selectedRegionId);

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-[var(--font-display)] text-xl font-semibold">Conservation Recommendations</h1>
            <p className="mt-1 text-xs text-[var(--color-text-faint)]">What should be done, and why, ranked by priority</p>
          </div>
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm"
          >
            {(regions.length ? regions : [{ id: selectedRegionId, name: selectedRegionId }]).map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {loading && !data && <LoadingState label="Generating recommendations..." />}
        {error && <ErrorState message={error} />}

        {data && (
          <>
            <ExplanationPanel explanation={data.aiExplanation} />
            <div className="grid gap-3 md:grid-cols-2">
              {data.recommendations.map((rec, i) => <RecommendationCard key={i} rec={rec} />)}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
