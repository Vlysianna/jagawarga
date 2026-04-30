"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  HelpCircle,
  Phone,
  Siren,
  X,
  type LucideIcon,
} from "lucide-react";
import { getAuthUser } from "@/lib/utils/auth";
import { pushHelpAlert } from "@/lib/utils/help-alerts";
import type { HelpLevel } from "@/lib/utils/help-alerts";

const LEVELS: {
  level: HelpLevel;
  label: string;
  icon: LucideIcon;
  className: string;
}[] = [
  {
    level: "ringan",
    label: "Ringan",
    icon: HelpCircle,
    className: "bg-blue-light text-blue-dark border-blue-border",
  },
  {
    level: "mendesak",
    label: "Mendesak",
    icon: Siren,
    className: "bg-yellow-light text-yellow-dark border-yellow-warning/30",
  },
  {
    level: "darurat",
    label: "Darurat",
    icon: AlertTriangle,
    className: "bg-red-light text-red-danger border-red-danger/30",
  },
];

export default function FloatingHelp() {
  const [open, setOpen] = useState(false);
  const [sentLabel, setSentLabel] = useState<string | null>(null);
  const user = useMemo(() => getAuthUser(), []);

  function createId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `help-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function sendHelp(level: HelpLevel, label: string) {
    if (!user) return;

    pushHelpAlert({
      id: createId(),
      level,
      senderId: user.id,
      senderName: user.name,
      rt: user.detail?.rt ?? null,
      createdAt: new Date().toISOString(),
    });

    setSentLabel(label);
    setTimeout(() => {
      setSentLabel(null);
      setOpen(false);
    }, 1300);
  }

  return (
    <div className="fixed z-50 md:bottom-6 md:right-6 right-3 bottom-24">
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-xl border border-neutral-border z-50 overflow-hidden">
            <div className="bg-blue-primary px-4 py-3 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Bantuan Cepat</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 space-y-2">
              {LEVELS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.level}
                    onClick={() => sendHelp(item.level, item.label)}
                    className={`w-full rounded-xl border p-4 text-left font-semibold transition-all hover:shadow-sm cursor-pointer ${item.className}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon size={18} />
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {sentLabel && (
              <div className="px-4 py-3 bg-green-light border-t border-green-action/20 text-xs text-green-dark font-medium">
                Notifikasi bantuan {sentLabel.toLowerCase()} terkirim.
              </div>
            )}
          </div>
        </>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          transition-all duration-200 cursor-pointer relative z-50
          ${
            open
              ? "bg-neutral-dark text-white"
              : "bg-red-danger text-white hover:bg-red-700 hover:scale-105"
          }
        `}
      >
        {open ? <X size={24} /> : <Phone size={24} />}
      </button>
    </div>
  );
}
