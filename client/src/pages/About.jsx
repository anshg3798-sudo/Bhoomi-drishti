import AppLayout from "../components/AppLayout";
import { Sprout, Users, TrendingUp } from "lucide-react";

const IMPACT = [
  "Faster assessment than manual field surveys",
  "Proactive intervention before visible degradation",
  "Better conservation prioritization across districts",
  "Better resource allocation for limited conservation budgets",
  "Citizen participation closing the loop between prediction and ground truth"
];

const USERS = ["Farmers", "Watershed committees", "State agriculture departments", "Soil conservation departments", "NGOs and land restoration authorities"];

export default function About() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8 p-4 md:p-6">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-semibold">About Bhoomi-Drishti</h1>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">Geo-AI Predictive Soil Erosion Monitoring &amp; Conservation Recommendation Platform</p>
        </div>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-amber)]">Problem</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
            India loses a significant amount of topsoil annually due to erosion. Assessment today is largely
            manual, slow and reactive, which means intervention typically happens only after degradation is
            already visible on the ground.
          </p>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-green)]">Solution</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
            Bhoomi-Drishti combines satellite and environmental information with the RUSLE soil-loss model,
            hydrological flow analysis, trend-based erosion forecasting and rule-based conservation
            recommendations \u2014 then closes the loop with citizen-submitted field photographs that validate
            what the system observes from above.
          </p>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-blue)]">
            <Users className="h-3.5 w-3.5" /> Users
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {USERS.map((u) => (
              <li key={u} className="rounded-lg bg-[var(--color-surface-2)] px-3 py-2 text-xs text-[var(--color-text-muted)]">{u}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-clay)]">
            <TrendingUp className="h-3.5 w-3.5" /> Impact
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-text-muted)]">
            {IMPACT.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <Sprout className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                {i}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-center text-[11px] text-[var(--color-text-faint)]">
          Prototype built for Smart India Hackathon 2026. Figures and scenarios reflect a seeded demo dataset
          unless live satellite integration is configured \u2014 see the Data Mode indicator in the top bar.
        </p>
      </div>
    </AppLayout>
  );
}
