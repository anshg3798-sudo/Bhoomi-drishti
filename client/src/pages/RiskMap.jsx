import AppLayout from "../components/AppLayout";
import MapView from "../components/MapView";
import { LoadingState, ErrorState } from "../components/States";
import { useRegion } from "../context/RegionContext";
import { useAnalysis } from "../hooks/useAnalysis";
import { usePriorityZones } from "../hooks/usePriorityZones";

export default function RiskMap() {
  const { selectedRegionId, setSelectedRegionId } = useRegion();
  const { data, loading, error } = useAnalysis(selectedRegionId);
  const { zones, loading: zonesLoading } = usePriorityZones();

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-semibold">Risk Map</h1>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">
            Click a region marker to inspect erosion, flood and drought risk, plus hydrological flow paths and priority zones.
          </p>
        </div>

        {(loading || zonesLoading) && !data && <LoadingState label="Loading map data..." />}
        {error && <ErrorState message={error} />}

        <MapView
          zones={zones}
          selectedRegionId={selectedRegionId}
          onSelectRegion={setSelectedRegionId}
          hydrology={data?.hydrology}
          height="calc(100vh - 220px)"
        />
      </div>
    </AppLayout>
  );
}
