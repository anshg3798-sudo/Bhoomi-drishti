import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mountain, ArrowRight, Satellite, Calculator, Waves, Sprout, Camera, TrendingUp } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";

const WORKFLOW = [
  { icon: Satellite, label: "Satellite & Environmental Data", desc: "Sentinel-1/2, SRTM, CHIRPS, SoilGrids" },
  { icon: Calculator, label: "RUSLE Soil-Loss Estimation", desc: "Transparent A = R\u00d7K\u00d7LS\u00d7C\u00d7P calculation" },
  { icon: Waves, label: "Hydrological Analysis", desc: "Flow accumulation & runoff prioritization" },
  { icon: TrendingUp, label: "Erosion Prediction", desc: "Trend-based one-to-two season forecast" },
  { icon: Sprout, label: "Conservation Recommendations", desc: "Check dams, bunding, agroforestry & more" },
  { icon: Camera, label: "Citizen Photo Validation", desc: "Ground truth confirms satellite predictions" }
];

const CAPABILITIES = [
  { title: "RUSLE Engine", desc: "Deterministic, explainable soil-loss estimation with a full factor breakdown \u2014 never a black box." },
  { title: "Flood & Drought Monitoring", desc: "Extends erosion risk into broader land-risk indicators using rainfall, NDVI and moisture proxies." },
  { title: "Citizen Validation Loop", desc: "Farmer-submitted field photos close the loop between satellite prediction and ground reality." }
];

const RUSLE_FACTORS = [
  { letter: "R", name: "Rainfall Erosivity" },
  { letter: "K", name: "Soil Erodibility" },
  { letter: "LS", name: "Slope Length" },
  { letter: "C", name: "Cover Management" },
  { letter: "P", name: "Support Practice" }
];

export default function Landing() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-green-soft)] text-[var(--color-green)]">
            <Mountain className="h-4.5 w-4.5" />
          </div>
          <span className="font-[var(--font-display)] text-base font-semibold">Bhoomi-Drishti</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/login"
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-green)]/40 hover:text-[var(--color-text)]"
          >
            {t("common.signIn")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="contour-field relative mx-auto max-w-6xl px-6 pb-16 pt-10 md:pt-16">
        <p className="eyebrow mb-5">{t("landing.eyebrow")}</p>
        <h1 className="display-hero max-w-4xl text-5xl md:text-7xl">
          {t("landing.heroLine1")} <span className="text-[var(--color-clay)]">{t("landing.heroLine2")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
          {t("landing.heroDesc")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-green)] px-5 py-2.5 text-sm font-semibold text-[#fdfcf6] transition-transform hover:translate-y-[-1px]"
          >
            {t("landing.exploreDashboard")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login?demo=analysis"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-text-muted)]"
          >
            {t("landing.viewDemo")}
          </Link>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6">
        <div className="strata">
          <span className="strata-topsoil" />
          <span className="strata-subsoil" />
          <span className="strata-clay" />
          <span className="strata-bedrock" />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-[var(--color-text-faint)]">
          <span>0 cm</span>
          <span>soil profile read by the model, horizon by horizon</span>
          <span>120 cm</span>
        </div>
      </div>

      {/* Problem statement */}
      <section className="border-y border-[var(--color-border-soft)] bg-[var(--color-surface)]/50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="eyebrow text-[var(--color-amber)]">The problem</p>
              <p className="mt-3 text-lg leading-relaxed text-[var(--color-text-muted)]">
                Soil erosion assessment across India is largely manual, slow and reactive \u2014 by the time
                degradation is visible on the ground, topsoil and productivity have already been lost.
              </p>
            </div>
            <div>
              <p className="eyebrow text-[var(--color-green)]">The platform</p>
              <p className="mt-3 text-lg leading-relaxed text-[var(--color-text-muted)]">
                Bhoomi-Drishti combines RUSLE modelling, hydrological flow analysis and rainfall/vegetation
                trends into one visual, proactive workflow \u2014 from satellite signal to recommended action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="display-hero text-3xl md:text-4xl">From signal to intervention</h2>
        <p className="mt-3 text-sm text-[var(--color-text-faint)]">The six-stage pipeline behind every risk score you see.</p>

        <div className="relative mt-8">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-[var(--color-border)] lg:block" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {WORKFLOW.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="relative">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <div className="flex items-center gap-2 text-[var(--color-text-faint)]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-green)]/40 bg-[var(--color-bg)] text-[var(--color-green)]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="data-figure text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-faint)]">{desc}</p>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <span className="pointer-events-none absolute -right-5 top-7 z-10 hidden h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-green)] bg-[var(--color-bg)] text-[var(--color-green)] lg:flex">
                    <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RUSLE explainer */}
      <section className="border-y border-[var(--color-border-soft)] bg-[var(--color-surface)]/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="eyebrow text-[var(--color-clay)]">Transparent science</p>
              <h3 className="display-hero mt-2 text-2xl md:text-3xl">The RUSLE model, shown in full</h3>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
                Every soil-loss estimate is calculated with the Revised Universal Soil Loss Equation and
                shown factor-by-factor \u2014 rainfall erosivity, soil erodibility, slope, cover management and
                conservation practice \u2014 so nothing is a black box.
              </p>
            </div>
            <div className="relative rounded-2xl border-2 border-[var(--color-clay)]/40 bg-[var(--color-surface)] p-8 text-center shadow-[0_0_40px_-12px_rgba(193,113,63,0.35)]">
              <p className="data-figure text-3xl font-bold tracking-tight md:text-4xl">
                A = R &times; K &times; LS &times; C &times; P
              </p>
              <p className="mt-4 data-figure text-lg text-[var(--color-text-muted)]">
                850 &times; 0.32 &times; 1.8 &times; 0.35 &times; 0.7
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-faint)]">Estimated soil loss, in tonnes/hectare/year</p>

              <div className="mt-6 grid grid-cols-5 gap-2 border-t border-[var(--color-border-soft)] pt-5">
                {RUSLE_FACTORS.map(({ letter, name }) => (
                  <div key={letter}>
                    <p className="data-figure text-sm font-bold text-[var(--color-clay)]">{letter}</p>
                    <p className="mt-1 text-[10px] leading-tight text-[var(--color-text-faint)]">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="display-hero text-3xl md:text-4xl">Built beyond erosion alone</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-sm font-semibold">{c.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-faint)]">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-10 text-center">
          <h3 className="font-[var(--font-display)] text-xl font-semibold">See it work on real Indian regions</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-faint)]">
            Assam's flood-prone floodplains and Meghalaya's erosion-prone hill districts \u2014 loaded with demo data, ready to explore.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--color-green)] px-5 py-2.5 text-sm font-semibold text-[#fdfcf6]"
          >
            {t("landing.exploreDashboard")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border-soft)] px-6 py-6 text-center text-[11px] text-[var(--color-text-faint)]">
        Bhoomi-Drishti &middot; Prototype for Smart India Hackathon 2026 &middot; Demo environmental dataset unless configured otherwise
      </footer>
    </div>
  );
}
