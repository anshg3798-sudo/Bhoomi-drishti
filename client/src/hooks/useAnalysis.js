import { useEffect, useState, useCallback } from "react";
import api from "../api/client";

export function useAnalysis(regionId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    if (!regionId) return;
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.post("/analysis/run", { region: regionId });
      setData(res);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to run analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [regionId]);

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refetch: run };
}
