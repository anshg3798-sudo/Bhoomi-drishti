import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search, ChevronDown, X } from "lucide-react";

// Two-level picker: main dropdown lists state names only.
// Clicking a state expands its districts inline, directly below it
// (accordion-style) so nothing ever opens off-screen to the side.
export default function RegionPicker({ regions, selectedRegionId, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeState, setActiveState] = useState(null); // name of state whose district list is expanded
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const isLoading = regions.length === 0;

  const selected = regions.find((r) => r.id === selectedRegionId);

  // Group regions by state name
  const states = useMemo(() => {
    const map = new Map();
    for (const r of regions) {
      if (!map.has(r.name)) map.set(r.name, []);
      map.get(r.name).push(r);
    }
    return Array.from(map.entries())
      .map(([name, districts]) => ({
        name,
        districts: districts.slice().sort((a, b) => a.district.localeCompare(b.district))
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [regions]);

  // When searching, flatten to matching districts across all states
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return regions
      .filter(
        (r) => r.name.toLowerCase().includes(q) || r.district.toLowerCase().includes(q)
      )
      .sort((a, b) => a.name.localeCompare(b.name) || a.district.localeCompare(b.district));
  }, [regions, query]);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setActiveState(null);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        setActiveState(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      // Auto-expand the selected region's state so it's immediately visible.
      setActiveState(selected?.name ?? null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function selectRegion(r) {
    onChange(r.id);
    setOpen(false);
    setActiveState(null);
  }

  function toggleState(stateName) {
    setActiveState((prev) => (prev === stateName ? null : stateName));
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => !isLoading && setOpen((o) => !o)}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-left disabled:cursor-wait disabled:opacity-70"
      >
        <MapPin className="h-4 w-4 shrink-0 text-[var(--color-green)]" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold leading-tight">
            {isLoading ? "Loading regions\u2026" : selected ? selected.district : "Select region"}
          </span>
          <span className="block truncate text-[10px] leading-tight text-[var(--color-text-faint)]">
            {isLoading ? "" : selected ? selected.name : ""}
          </span>
        </span>
      </button>

      {open && !isLoading && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-64 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
          <div className="flex items-center gap-2 border-b border-[var(--color-border-soft)] px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-faint)]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search state or district…"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {searchResults ? (
            <ul className="max-h-80 overflow-y-auto scrollbar-thin py-1">
              {searchResults.length === 0 && (
                <li className="px-3 py-4 text-center text-xs text-[var(--color-text-faint)]">
                  No regions match &ldquo;{query}&rdquo;
                </li>
              )}
              {searchResults.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => selectRegion(r)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-[var(--color-surface-2)] ${
                      r.id === selectedRegionId ? "text-[var(--color-green)] font-semibold" : ""
                    }`}
                  >
                    <span className="truncate">{r.district}</span>
                    <span className="shrink-0 text-[10px] text-[var(--color-text-faint)]">{r.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="max-h-80 overflow-y-auto scrollbar-thin py-1">
              {states.map((s) => {
                const isExpanded = activeState === s.name;
                return (
                  <li key={s.name}>
                    <button
                      type="button"
                      onClick={() => toggleState(s.name)}
                      aria-expanded={isExpanded}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--color-surface-2)] ${
                        isExpanded ? "bg-[var(--color-surface-2)]" : ""
                      }`}
                    >
                      <span className="truncate font-medium">{s.name}</span>
                      <span className="flex items-center gap-1 shrink-0 text-[10px] text-[var(--color-text-faint)]">
                        {s.districts.length} districts
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>

                    {isExpanded && (
                      <ul className="border-t border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/40 py-1">
                        {s.districts.map((r) => (
                          <li key={r.id}>
                            <button
                              type="button"
                              onClick={() => selectRegion(r)}
                              className={`block w-full truncate py-1.5 pl-8 pr-3 text-left text-sm hover:bg-[var(--color-surface-2)] ${
                                r.id === selectedRegionId
                                  ? "text-[var(--color-green)] font-semibold"
                                  : ""
                              }`}
                            >
                              {r.district}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}