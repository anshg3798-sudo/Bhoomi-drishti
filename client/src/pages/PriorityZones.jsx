import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import AppLayout from "../components/AppLayout";
import MapView from "../components/MapView";
import { RiskPill } from "../components/Badges";
import { LoadingState, ErrorState } from "../components/States";
import { useRegion } from "../context/RegionContext";
import { usePriorityZones } from "../hooks/usePriorityZones";

const PRIORITY_ORDER = { Critical: 0, High: 1, Moderate: 2, Low: 3 };
const FILTERS = ["All", "Critical", "High", "Moderate", "Low"];

export default function PriorityZones() {
  const { setSelectedRegionId, selectedRegionId } = useRegion();
  const { zones, loading, error } = usePriorityZones();
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rank");

  const filtered = useMemo(() => {
    let list = filter === "All" ? zones : zones.filter((z) => z.priority === filter);
    list = [...list].sort((a, b) => {
      if (sortBy === "rank") return a.rank - b.rank;
      if (sortBy === "soilLoss") return b.soilLoss - a.soilLoss;
      if (sortBy === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return 0;
    });
    return list;
  }, [zones, filter, sortBy]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-semibold">Priority Zones</h1>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Ranked by combined erosion, flood and drought risk</p>
        </div>

        {loading && <LoadingState label="Ranking regions..." />}
        {error && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            <MapView zones={zones} selectedRegionId={selectedRegionId} onSelectRegion={setSelectedRegionId} height="360px" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      filter === f ? "bg-[var(--color-surface-3)] text-[var(--color-text)]" : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSortBy(sortBy === "rank" ? "soilLoss" : "rank")}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-muted)]"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort: {sortBy === "rank" ? "Rank" : "Soil loss"}
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
              <table className="w-full text-sm">
                <thead className="bg-[var(--color-surface-2)] text-left text-[11px] uppercase tracking-wide text-[var(--color-text-faint)]">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Region</th>
                    <th className="px-4 py-3">Soil Loss</th>
                    <th className="px-4 py-3">Erosion</th>
                    <th className="px-4 py-3">Flood</th>
                    <th className="px-4 py-3">Drought</th>
                    <th className="px-4 py-3">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((z) => (
                    <tr
                      key={z.id}
                      onClick={() => setSelectedRegionId(z.id)}
                      className={`cursor-pointer border-t border-[var(--color-border-soft)] hover:bg-[var(--color-surface-2)]/50 ${
                        z.id === selectedRegionId ? "bg-[var(--color-surface-2)]" : "bg-[var(--color-surface)]"
                      }`}
                    >
                      <td className="data-figure px-4 py-3 text-[var(--color-text-faint)]">{z.rank}</td>
                      <td className="px-4 py-3 font-medium">
                        {z.name}
                        {z.priorityReason && <span className="ml-2 text-[10px] text-[var(--color-text-faint)]">({z.priorityReason})</span>}
                      </td>
                      <td className="data-figure px-4 py-3 text-[var(--color-text-muted)]">{z.soilLoss} t/ha/yr</td>
                      <td className="px-4 py-3"><RiskPill category={z.erosionRisk} size="sm" /></td>
                      <td className="px-4 py-3"><RiskPill category={z.floodRisk} size="sm" /></td>
                      <td className="px-4 py-3"><RiskPill category={z.droughtRisk} size="sm" /></td>
                      <td className="px-4 py-3"><RiskPill category={z.priority} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
