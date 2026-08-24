import { useTranslation } from "react-i18next";
import AppLayout from "../components/AppLayout";
import { Sprout, Users, TrendingUp } from "lucide-react";

export default function About() {
  const { t } = useTranslation();
  const impact = t("about.impact", { returnObjects: true });
  const users = t("about.users", { returnObjects: true });

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8 p-4 md:p-6">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-semibold">{t("about.title")}</h1>
          <p className="mt-1 text-xs text-[var(--color-text-faint)]">{t("about.subtitle")}</p>
        </div>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-amber)]">{t("about.problemLabel")}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{t("about.problemText")}</p>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-green)]">{t("about.solutionLabel")}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{t("about.solutionText")}</p>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-blue)]">
            <Users className="h-3.5 w-3.5" /> {t("about.usersLabel")}
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {users.map((u) => (
              <li key={u} className="rounded-lg bg-[var(--color-surface-2)] px-3 py-2 text-xs text-[var(--color-text-muted)]">{u}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-clay)]">
            <TrendingUp className="h-3.5 w-3.5" /> {t("about.impactLabel")}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-text-muted)]">
            {impact.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <Sprout className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-green)]" />
                {i}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-center text-[11px] text-[var(--color-text-faint)]">{t("about.footer")}</p>
      </div>
    </AppLayout>
  );
}