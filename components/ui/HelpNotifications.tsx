"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, X } from "lucide-react";
import { getAuthUser } from "@/lib/utils/auth";
import { getHelpAlerts, HELP_ALERT_EVENT } from "@/lib/utils/help-alerts";
import type { HelpAlert, HelpLevel } from "@/lib/utils/help-alerts";

const LEVEL_BADGE: Record<HelpLevel, string> = {
  ringan: "bg-blue-primary text-white",
  mendesak: "bg-yellow-warning text-white",
  darurat: "bg-red-danger text-white",
};

const LEVEL_LABEL: Record<HelpLevel, string> = {
  ringan: "Ringan",
  mendesak: "Mendesak",
  darurat: "Darurat",
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.max(0, Math.floor(diffMs / 60000));
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function HelpNotifications() {
  const [alerts, setAlerts] = useState<HelpAlert[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const user = useMemo(() => getAuthUser(), []);

  useEffect(() => {
    function refresh() {
      setAlerts(getHelpAlerts());
    }

    function onStorage(event: StorageEvent) {
      if (event.key === "jagawarga_help_alerts") {
        refresh();
      }
    }

    refresh();
    window.addEventListener(HELP_ALERT_EVENT, refresh);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(HELP_ALERT_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const visibleAlerts = alerts.filter((alert) => {
    if (!user) return false;
    if (alert.senderId === user.id) return false;
    if (hiddenIds.includes(alert.id)) return false;
    if (!user.detail?.rt) return true;
    return alert.rt === user.detail.rt;
  });

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 w-80 space-y-2">
      {visibleAlerts.slice(0, 3).map((alert) => (
        <div
          key={alert.id}
          className="rounded-xl border border-neutral-border bg-white shadow-lg p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0">
              <Bell size={16} className="text-blue-primary mt-0.5" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${LEVEL_BADGE[alert.level]}`}
                  >
                    {LEVEL_LABEL[alert.level]}
                  </span>
                  <span className="text-[11px] text-neutral-text">
                    {timeAgo(alert.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-1">
                  Warga <strong>{alert.senderName}</strong> butuh bantuan
                  {" "}
                  <strong>{LEVEL_LABEL[alert.level].toLowerCase()}</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setHiddenIds((prev) => [...prev, alert.id])}
              className="text-neutral-text/60 hover:text-neutral-dark cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <button
            onClick={() => setHiddenIds((prev) => [...prev, alert.id])}
            className="mt-2 inline-flex items-center gap-1 text-xs text-green-dark font-medium hover:underline cursor-pointer"
          >
            <CheckCircle2 size={13} />
            Saya bantu
          </button>

          {alert.level === "darurat" && (
            <p className="mt-2 text-[11px] text-red-danger flex items-center gap-1">
              <AlertTriangle size={12} />
              Prioritas tinggi
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
