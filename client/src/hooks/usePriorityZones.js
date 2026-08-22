import { useEffect, useState, useCallback } from "react";
import api from "../api/client";

export function usePriorityZones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/priority-zones");
      setZones(data.zones || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load priority zones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { zones, loading, error, refetch: load };
}
