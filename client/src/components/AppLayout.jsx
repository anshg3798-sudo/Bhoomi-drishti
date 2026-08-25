import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home, LayoutDashboard, SearchCode, Map as MapIcon, ListOrdered, Sprout,
  Camera, Info, LogOut, Mountain
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRegion } from "../context/RegionContext";
import { DataModeBadge } from "./Badges";
import RegionPicker from "./RegionPicker";
import LanguageSwitcher from "./LanguageSwitcher";

export default function AppLayout({ children }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { regions, selectedRegionId, setSelectedRegionId, health } = useRegion();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { to: "/", label: t("nav.home"), icon: Home, end: true },
    { to: "/dashboard", label: t("nav.overview"), icon: LayoutDashboard },
    { to: "/analysis", label: t("nav.analyze"), icon: SearchCode },
    { to: "/risk-map", label: t("nav.riskMap"), icon: MapIcon },
    { to: "/priority-zones", label: t("nav.priorityZones"), icon: ListOrdered },
    { to: "/recommendations", label: t("nav.recommendations"), icon: Sprout },
    { to: "/validation", label: t("nav.validation"), icon: Camera },
    { to: "/about", label: t("nav.about"), icon: Info }
  ];

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
            <p className="eyebrow mt-1.5 text-[9px]">Geo-AI Erosion Platform</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2 scrollbar-thin overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
              title={t("common.logout")}
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
            <span className="text-xs text-[var(--color-text-faint)] hidden sm:inline">{t("common.region")}</span>
            <RegionPicker
              regions={regions}
              selectedRegionId={selectedRegionId}
              onChange={setSelectedRegionId}
            />
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
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