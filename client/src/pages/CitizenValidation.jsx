import { useEffect, useState } from "react";
import { Camera, MapPin, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { LoadingState, ErrorState, EmptyState } from "../components/States";
import { useRegion } from "../context/RegionContext";
import api from "../api/client";

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

const STATUS_STYLE = {
  Pending: { icon: Clock, cls: "text-[var(--color-amber)] bg-[var(--color-amber-soft)]" },
  Confirmed: { icon: CheckCircle2, cls: "text-[var(--color-green)] bg-[var(--color-green-soft)]" },
  Rejected: { icon: XCircle, cls: "text-[var(--color-red)] bg-[var(--color-red-soft)]" }
};

export default function CitizenValidation() {
  const { regions, selectedRegionId } = useRegion();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ region: selectedRegionId, description: "", imageName: "" });
  const [validatingId, setValidatingId] = useState(null);

  async function loadReports() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/citizen-reports");
      setReports(data.reports || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load citizen reports.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReports(); }, []);
  useEffect(() => { setForm((f) => ({ ...f, region: selectedRegionId })); }, [selectedRegionId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const region = regions.find((r) => r.id === form.region);
    try {
      await api.post("/citizen-reports", {
        region: region?.name || form.region,
        latitude: region?.coordinates?.[0] || 22.5,
        longitude: region?.coordinates?.[1] || 82,
        description: form.description,
        imageRef: form.imageName || null
      });
      setForm((f) => ({ ...f, description: "", imageName: "" }));
      await loadReports();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not submit report.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleValidate(id, status) {
    setValidatingId(id);
    try {
      await api.patch(`/citizen-reports/${id}/validate`, { status });
      await loadReports();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update validation status.");
    } finally {
      setValidatingId(null);
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-semibold">Citizen Validation</h1>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Ground observations validate what the satellite predicts</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Submission form */}
          <form onSubmit={handleSubmit} className="h-fit rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Camera className="h-4 w-4 text-[var(--color-green)]" /> Submit Field Report
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[11px] text-[var(--color-text-faint)]">Region</label>
                <select
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm"
                >
                  {(regions.length ? regions : [{ id: selectedRegionId, name: selectedRegionId }]).map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[var(--color-text-faint)]">Field photograph</label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-4 text-xs text-[var(--color-text-faint)] hover:border-[var(--color-green)]/40">
                  <Camera className="h-4 w-4" />
                  {form.imageName || "Choose photo (demo reference only)"}
                  <input
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => setForm((f) => ({ ...f, imageName: e.target.files?.[0]?.name || "" }))}
                  />
                </label>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-[var(--color-text-faint)]">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="e.g. Visible gully erosion near the field boundary"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit" disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-green)] px-4 py-2.5 text-sm font-semibold text-[#06110c] disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Report
              </button>
            </div>
          </form>

          {/* Reports feed */}
          <div className="space-y-3">
            {loading && <LoadingState label="Loading citizen reports..." />}
            {error && <ErrorState message={error} />}
            {!loading && reports.length === 0 && <EmptyState title="No field reports yet" description="Submitted photos will appear here and on the map." icon={Camera} />}

            {reports.map((r) => {
              const status = STATUS_STYLE[r.validationStatus] || STATUS_STYLE.Pending;
              const StatusIcon = status.icon;
              return (
                <div key={r._id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{r.userName || "Farmer Report"}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--color-text-faint)]">
                        <MapPin className="h-3 w-3" /> {r.region} &middot; {timeAgo(r.createdAt)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${status.cls}`}>
                      <StatusIcon className="h-3 w-3" /> {r.validationStatus}
                    </span>
                  </div>
                  {r.description && <p className="mt-2 text-sm text-[var(--color-text-muted)]">{r.description}</p>}

                  <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-[var(--color-border-soft)] pt-3 text-[11px]">
                    <div>
                      <span className="text-[var(--color-text-faint)]">Satellite prediction confidence: </span>
                      <span className="data-figure text-[var(--color-text-muted)]">{r.modelConfidenceBefore}%</span>
                    </div>
                    {r.modelConfidenceAfter != null && (
                      <div>
                        <span className="text-[var(--color-text-faint)]">After ground validation: </span>
                        <span className="data-figure font-semibold text-[var(--color-green)]">{r.modelConfidenceAfter}% &uarr;</span>
                      </div>
                    )}
                  </div>

                  {r.validationStatus === "Pending" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleValidate(r._id, "Confirmed")}
                        disabled={validatingId === r._id}
                        className="flex items-center gap-1.5 rounded-lg bg-[var(--color-green-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-green)]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Confirm erosion visible
                      </button>
                      <button
                        onClick={() => handleValidate(r._id, "Rejected")}
                        disabled={validatingId === r._id}
                        className="flex items-center gap-1.5 rounded-lg bg-[var(--color-red-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-red)]"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Not visible
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
