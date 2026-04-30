"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { getAuthUser, logout, getDashboardPath } from "@/lib/utils/auth";
import { ROLE_LABELS, AuthUser } from "@/lib/types/user";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const user: AuthUser | null = mounted ? getAuthUser() : null;

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted || !user) return null;

  const dashboardHref = getDashboardPath(user.role);
  const isActive = pathname === dashboardHref || pathname.startsWith(dashboardHref + "/");
  const detailText = [
    user.detail?.provinsi,
    user.detail?.daerah,
    user.detail?.kecamatan && `Kec. ${user.detail.kecamatan}`,
    user.detail?.kelurahan && `Kel. ${user.detail.kelurahan}`,
    user.detail?.rw && `RW ${user.detail.rw}`,
    user.detail?.rt && `RT ${user.detail.rt}`,
  ]
    .filter(Boolean)
    .join(" · ");

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  return (
    <aside className="w-64 bg-white border-r border-neutral-border flex flex-col h-screen sticky top-0 shrink-0">
      {/* Header */}
      <div className="bg-blue-primary px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-primary font-bold text-sm">JW</span>
          </div>
          <span className="text-white text-lg font-bold tracking-tight">
            JagaWarga
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-neutral-border">
        <p className="text-sm font-medium text-foreground truncate">
          {user.name}
        </p>
        <p className="text-xs text-neutral-text mt-0.5">
          {ROLE_LABELS[user.role]}
          {detailText && ` · ${detailText}`}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <Link
          href={dashboardHref}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
            transition-colors duration-150
            ${
              isActive
                ? "bg-blue-light text-blue-primary"
                : "text-neutral-dark hover:bg-neutral-bg"
            }
          `}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-neutral-border">
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
            text-red-danger hover:bg-red-light transition-colors duration-150
            cursor-pointer
          "
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
