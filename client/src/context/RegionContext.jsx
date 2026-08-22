import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/client";

const RegionContext = createContext(null);

export function RegionProvider({ children }) {
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState("assam");
  const [health, setHealth] = useState(null);

  const loadRegions = useCallback(async () => {
    try {
      const { data } = await api.get("/regions");
      setRegions(data.regions || []);
    } catch (err) {
      console.error("Failed to load regions", err);
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
