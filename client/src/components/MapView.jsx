import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, useMap } from "react-leaflet";
import { Layers } from "lucide-react";
import { RiskPill } from "./Badges";
import "leaflet/dist/leaflet.css";

const LAYER_OPTIONS = [
  { id: "erosion", label: "Erosion Risk" },
  { id: "flood", label: "Flood Risk" },
  { id: "drought", label: "Drought Risk" }
];

const CATEGORY_COLOR = {
  "Very Low": "#3f6b32",
  Low: "#3f6b32",
  Moderate: "#93691b",
  High: "#8c451f",
  "Very High": "#7a3018",
  Critical: "#5c2412"
};
const LEGEND_ITEMS = [
  { label: "Low", color: "#3f6b32" },
  { label: "Moderate", color: "#93691b" },
  { label: "High", color: "#8c451f" },
  { label: "Very High", color: "#7a3018" },
  { label: "Critical", color: "#5c2412" }
];

function scoreCategory(score) {
  if (score < 25) return "Low";
  if (score < 50) return "Moderate";
  if (score < 75) return "High";
  return "Very High";
}

function Recenter({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates) map.flyTo(coordinates, 7, { duration: 0.6 });
  }, [coordinates, map]);
  return null;
}

export default function MapView({
  zones = [],
  selectedRegionId,
  onSelectRegion,
  hydrology,
  citizenReports = [],
  height = "460px"
}) {
  const [activeLayer, setActiveLayer] = useState("erosion");
  const [showFlow, setShowFlow] = useState(true);
  const [showPriorityZone, setShowPriorityZone] = useState(true);
  const [showReports, setShowReports] = useState(false);

  const selected = zones.find((z) => z.id === selectedRegionId);

  const markers = useMemo(() => {
    return zones.map((z) => {
      let category = z.erosionRisk;
      let scoreLabel = `${z.soilLoss} t/ha/yr`;
      if (activeLayer === "flood") { category = z.floodRisk; scoreLabel = "Flood risk"; }
      if (activeLayer === "drought") { category = z.droughtRisk; scoreLabel = "Drought risk"; }
      return { ...z, category, scoreLabel };
    });
  }, [zones, activeLayer]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)]" style={{ height }}>
      <MapContainer
        center={selected?.coordinates || [22.5, 82]}
        zoom={selected ? 7 : 5}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter coordinates={selected?.coordinates} />

        {markers.map((z) => (
          <CircleMarker
            key={z.id}
            center={z.coordinates}
            radius={z.id === selectedRegionId ? 16 : 11}
            pathOptions={{
              color: CATEGORY_COLOR[z.category] || "#8f9ab3",
              fillColor: CATEGORY_COLOR[z.category] || "#8f9ab3",
              fillOpacity: z.id === selectedRegionId ? 0.55 : 0.35,
              weight: z.id === selectedRegionId ? 3 : 1.5
            }}
            eventHandlers={{ click: () => onSelectRegion?.(z.id) }}
          >
            <Popup>
              <div className="min-w-[180px] space-y-1.5 font-sans text-[13px]">
                <p className="font-semibold text-slate-900">Selected Region: {z.name}</p>
                <p className="text-slate-600">Estimated Soil Loss: {z.soilLoss} t/ha/year</p>
                <p className="text-slate-600">Erosion Risk: {z.erosionRisk}</p>
                <p className="text-slate-600">Flood Risk: {z.floodRisk}</p>
                <p className="text-slate-600">Drought Risk: {z.droughtRisk}</p>
                <p className="text-slate-600">Priority: {z.priority}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {showFlow && hydrology?.flowPaths && (
          <GeoJSON
            data={hydrology.flowPaths}
            style={() => ({ color: "#4a93c9", weight: 2.5, dashArray: "1 6", opacity: 0.85 })}
          />
        )}

        {showPriorityZone && hydrology?.priorityZone && (
          <GeoJSON
            data={hydrology.priorityZone}
            style={() => ({ color: "#7a3018", weight: 1.5, fillColor: "#7a3018", fillOpacity: 0.12, dashArray: "4 4" })}
          />
        )}

        {showReports && citizenReports.map((r) => (
          <CircleMarker
            key={r._id}
            center={r.coordinates}
            radius={7}
            pathOptions={{ color: "#2b2820", fillColor: "#fffdf9", fillOpacity: 0.9, weight: 2 }}
          >
            <Popup>
              <div className="min-w-[160px] space-y-1 font-sans text-[13px]">
                <p className="font-semibold text-slate-900">Farmer Report</p>
                <p className="text-slate-600">{r.description || "No description provided"}</p>
                <p className="text-slate-500">{r.region}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Layer control panel */}
      <div className="absolute right-3 top-3 z-[1000] w-44 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-2.5 text-xs shadow-lg backdrop-blur">
        <div className="mb-1.5 flex items-center gap-1.5 text-[var(--color-text-muted)]">
          <Layers className="h-3.5 w-3.5" />
          <span className="font-medium">Layers</span>
        </div>
        <div className="space-y-1">
          {LAYER_OPTIONS.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`block w-full rounded-md px-2 py-1 text-left ${
                activeLayer === l.id ? "bg-[var(--color-surface-3)] text-[var(--color-text)]" : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="my-2 border-t border-[var(--color-border-soft)]" />
        <label className="flex items-center gap-2 py-0.5 text-[var(--color-text-muted)]">
          <input type="checkbox" checked={showFlow} onChange={(e) => setShowFlow(e.target.checked)} />
          Hydrological Flow
        </label>
        <label className="flex items-center gap-2 py-0.5 text-[var(--color-text-muted)]">
          <input type="checkbox" checked={showPriorityZone} onChange={(e) => setShowPriorityZone(e.target.checked)} />
          Priority Zones
        </label>
        <label className="flex items-center gap-2 py-0.5 text-[var(--color-text-muted)]">
          <input type="checkbox" checked={showReports} onChange={(e) => setShowReports(e.target.checked)} />
          Citizen Reports
        </label>
      </div>

      {selected && (
        <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
          <p className="font-semibold">{selected.name}</p>
          <div className="mt-1 flex gap-1.5">
            <RiskPill category={selected.erosionRisk} size="sm" />
            <RiskPill category={selected.floodRisk} size="sm" />
          </div>
        </div>
      )}
      <div className="absolute bottom-3 right-3 z-[1000] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
        <p className="mb-1.5 font-medium text-[var(--color-text-muted)]">Risk Level</p>
        <div className="space-y-1">
          {LEGEND_ITEMS.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[var(--color-text-muted)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}