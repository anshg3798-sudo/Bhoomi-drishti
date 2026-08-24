import { useTranslation } from "react-i18next";
import { Loader2, Inbox, AlertTriangle } from "lucide-react";

export function LoadingState({ label }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[var(--color-text-muted)]">
      <Loader2 className="h-6 w-6 animate-spin text-[var(--color-green)]" />
      <p className="text-sm">{label || t("states.loadingDefault")}</p>
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon = Inbox }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-14 text-center">
      <Icon className="h-6 w-6 text-[var(--color-text-faint)]" />
      <p className="text-sm font-medium text-[var(--color-text-muted)]">{title || t("states.emptyDefault")}</p>
      {description && <p className="max-w-sm text-xs text-[var(--color-text-faint)]">{description}</p>}
    </div>
  );
}

export function ErrorState({ message }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--color-red)]/30 bg-[var(--color-red-soft)] p-4 text-sm text-[var(--color-red)]">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message || t("states.errorDefault")}</span>
    </div>
  );
}