import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, SearchCode, Map as MapIcon, ListOrdered, Sprout,
  Camera, Info, LogOut, Mountain, ChevronDown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRegion } from "../context/RegionContext";
import { DataModeBadge } from "./Badges";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/analysis", label: "Analyze Region", icon: SearchCode },
  { to: "/risk-map", label: "Risk Map", icon: MapIcon },
  { to: "/priority-zones", label: "Priority Zones", icon: ListOrdered },
  { to: "/recommendations", label: "Recommendations", icon: Sprout },
  { to: "/validation", label: "Citizen Validation", icon: Camera },
  { to: "/about", label: "About Bhoomi-Drishti", icon: Info }
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const { regions, selectedRegionId, setSelectedRegionId, health } = useRegion();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--color-border-soft)] bg-[var(--color-surface)] md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-green-soft)] text-[var(--color-green)]">
            <Mountain className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="font-[var(--font-display)] text-sm font-semibold leading-none">Bhoomi-Drishti</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">Geo-AI Erosion Platform</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2 scrollbar-thin overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--color-surface-2)] text-[var(--color-text)] font-medium"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]/60 hover:text-[var(--color-text)]"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--color-border-soft)] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-[11px] capitalize text-[var(--color-text-faint)]">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md p-1.5 text-[var(--color-text-faint)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-red)]"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-soft)] bg-[var(--color-surface)]/70 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--color-text-faint)] hidden sm:inline">Region</span>
            <div className="relative">
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] py-1.5 pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-green)]/40"
              >
                {(regions.length ? regions : [{ id: "assam", name: "Assam" }]).map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-faint)]" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DataModeBadge mode={health?.dataMode || "DEMO"} />
            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-xs font-semibold sm:flex">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin">{children}</main>
      </div>
    </div>
  );
}
