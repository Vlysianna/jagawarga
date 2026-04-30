export type HelpLevel = "ringan" | "mendesak" | "darurat";

export interface HelpAlert {
  id: string;
  level: HelpLevel;
  senderId: string;
  senderName: string;
  rt: string | null;
  createdAt: string;
}

const HELP_ALERT_STORAGE_KEY = "jagawarga_help_alerts";
export const HELP_ALERT_EVENT = "jagawarga-help-alerts";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeParse(value: string | null): HelpAlert[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is HelpAlert =>
        item &&
        typeof item.id === "string" &&
        typeof item.level === "string" &&
        typeof item.senderId === "string" &&
        typeof item.senderName === "string" &&
        typeof item.createdAt === "string"
    );
  } catch {
    return [];
  }
}

export function getHelpAlerts(): HelpAlert[] {
  if (!isBrowser()) return [];
  return safeParse(localStorage.getItem(HELP_ALERT_STORAGE_KEY));
}

export function pushHelpAlert(alert: HelpAlert): void {
  if (!isBrowser()) return;
  const existing = getHelpAlerts();
  const next = [alert, ...existing].slice(0, 50);
  localStorage.setItem(HELP_ALERT_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(
    new CustomEvent(HELP_ALERT_EVENT, {
      detail: alert,
    })
  );
}

export function clearHelpAlerts(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(HELP_ALERT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(HELP_ALERT_EVENT));
}
