import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client";
import demoRegions from "../components/demoRegions";

const RegionContext = createContext(null);
const ALLOWED_STATES = new Set(["Assam", "Meghalaya"]);
function restrictToPilotStates(list) {
  return (list || []).filter((r) => ALLOWED_STATES.has(r.name));
}

export function RegionProvider({ children }) {
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState("assam");
  const [health, setHealth] = useState(null);

  const loadRegions = useCallback(async () => {
    try {
      const { data } = await api.get("/regions");
      const filtered = restrictToPilotStates(data.regions);
      setRegions(filtered.length > 0 ? filtered : demoRegions);
    } catch (err) {
      console.error("Failed to load regions, using local demo dataset", err);
      setRegions(demoRegions);
    }
  }, []);

  const loadHealth = useCallback(async () => {
    try {
      const { data } = await api.get("/health");
      setHealth(data);
    } catch (err) {
      setHealth({ success: false, dataMode: "DEMO", error: true });
    }
  }, []);

  useEffect(() => {
    loadRegions();
    loadHealth();
  }, [loadRegions, loadHealth]);

  return (
    <RegionContext.Provider
      value={{ regions, selectedRegionId, setSelectedRegionId, health, refreshHealth: loadHealth }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used within RegionProvider");
  return ctx;
}
