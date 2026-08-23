import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search, ChevronRight, X } from "lucide-react";

// Two-level picker: main dropdown lists state names only.
// Hovering (or clicking, for touch/keyboard) a state opens a
// flyout submenu listing that state's districts.
export default function RegionPicker({ regions, selectedRegionId, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeState, setActiveState] = useState(null); // name of state whose submenu is open
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const closeSubmenuTimer = useRef(null);
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
      setActiveState(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  function selectRegion(r) {
    onChange(r.id);
    setOpen(false);
    setActiveState(null);
  }

  function handleStateEnter(stateName) {
    if (closeSubmenuTimer.current) clearTimeout(closeSubmenuTimer.current);
    setActiveState(stateName);
  }

  function handleStateLeave() {
    closeSubmenuTimer.current = setTimeout(() => setActiveState(null), 150);
  }

  function handleStateClick(stateName) {
    // Touch/keyboard fallback: click toggles the submenu open
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
        <div className="absolute left-0 top-full z-50 mt-1.5 w-64 overflow-visible rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
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
            <ul className="max-h-72 overflow-y-auto scrollbar-thin py-1">
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
            <ul className="max-h-72 overflow-y-auto scrollbar-thin py-1">
              {states.map((s) => (
                <li
                  key={s.name}
                  className="relative"
                  onMouseEnter={() => handleStateEnter(s.name)}
                  onMouseLeave={handleStateLeave}
                >
                  <button
                    type="button"
                    onClick={() => handleStateClick(s.name)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--color-surface-2)] ${
                      activeState === s.name ? "bg-[var(--color-surface-2)]" : ""
                    }`}
                  >
                    <span className="truncate font-medium">{s.name}</span>
                    <span className="flex items-center gap-1 shrink-0 text-[10px] text-[var(--color-text-faint)]">
                      {s.districts.length} districts
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  {activeState === s.name && (
                    <div
                      className="absolute left-full top-0 z-50 ml-1 w-60 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl"
                      onMouseEnter={() => handleStateEnter(s.name)}
                      onMouseLeave={handleStateLeave}
                    >
                      <ul className="max-h-72 overflow-y-auto scrollbar-thin py-1">
                        {s.districts.map((r) => (
                          <li key={r.id}>
                            <button
                              type="button"
                              onClick={() => selectRegion(r)}
                              className={`block w-full truncate px-3 py-1.5 text-left text-sm hover:bg-[var(--color-surface-2)] ${
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
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}