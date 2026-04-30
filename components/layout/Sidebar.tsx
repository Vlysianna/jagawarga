"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LogOut,
  ChevronUp,
  Wallet,
  HeartHandshake,
  Users,
  type LucideIcon,
  MoreHorizontal,
} from "lucide-react";
import { getAuthUser, logout, getDashboardPath } from "@/lib/utils/auth";
import { ROLE_LABELS, AuthUser, UserRole } from "@/lib/types/user";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: {
    href: string;
    label: string;
  }[];
}

function getNavItems(role: UserRole): NavItem[] {
  const base = getDashboardPath(role);
  const rolePrefix = base.replace("/dashboard", "");

  const items: NavItem[] = [
    { href: base, label: "Dashboard", icon: LayoutDashboard },
    {
      label: "Chat",
      icon: MessageSquare,
      children: [
        { href: `${rolePrefix}/chat?mode=private`, label: "Private" },
        ...(role === "rt" || role === "citizen"
          ? [{ href: `${rolePrefix}/chat?mode=rt`, label: "Chat RT" }]
          : []),
      ],
    },
    { href: `${rolePrefix}/reports`, label: "Laporan", icon: FileText },
  ];

  if (role === "citizen")
    items.push({ href: `${rolePrefix}/kas`, label: "Kas", icon: Wallet });

  if (role === "citizen" || role === "rt") {
    items.push({
      href: `${rolePrefix}/lansia`,
      label: "Lansia",
      icon: HeartHandshake,
    });
  }

  if (["rt", "rw", "kel", "kec", "pemda"].includes(role)) {
    items.push({
      href: `${rolePrefix}/users`,
      label: "Data User",
      icon: Users,
    });
  }

  return items;
}

function isActivePath(pathname: string, href: string, role: UserRole) {
  return (
    pathname === href ||
    (href !== getDashboardPath(role) && pathname.startsWith(href + "/")) ||
    (href === getDashboardPath(role) && pathname === href)
  );
}

function getActiveChatMode(searchParams: ReturnType<typeof useSearchParams>) {
  const mode = searchParams.get("mode");
  return mode === "private" || mode === "rt" ? mode : null;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const user: AuthUser | null = mounted ? getAuthUser() : null;
  const activeChatMode = getActiveChatMode(searchParams);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted || !user) return null;

  const navItems = getNavItems(user.role);
  const detailText = [
    user.detail?.kecamatan && `Kec. ${user.detail.kecamatan}`,
    user.detail?.kelurahan && `Kel. ${user.detail.kelurahan}`,
    user.detail?.rw && `RW ${user.detail.rw}`,
    user.detail?.rt && `RT ${user.detail.rt}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const MAX_VISIBLE = 5;
  const visibleItems = navItems.slice(0, MAX_VISIBLE - 1);
  const overflowItems = navItems.slice(MAX_VISIBLE - 1);

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  return (
    <>
      <aside className="sticky top-0 hidden h-screen border-r border-neutral-border bg-white md:flex md:flex-col">
        <div className="flex items-center gap-3 border-b border-neutral-border px-5 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-primary text-sm font-bold text-white">
            JW
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight text-foreground">
              JagaWarga
            </p>
            <p className="truncate text-xs text-neutral-text">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 px-4 py-5">
          <div className="rounded-2xl border border-neutral-border bg-neutral-bg/60 p-4">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </p>
            <p className="mt-1 text-xs leading-5 text-neutral-text">
              {detailText || "Akses wilayah aktif"}
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.href
                ? isActivePath(pathname, item.href, user.role)
                : pathname.includes("/chat");

              if (!item.children || !item.children.length) {
                return (
                  <Link
                    key={item.href ?? item.label}
                    href={item.href ?? "/"}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-light text-blue-primary"
                        : "text-neutral-dark hover:bg-neutral-bg"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-neutral-border bg-white p-2"
                >
                  <div
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      active
                        ? "bg-blue-light text-blue-primary"
                        : "text-neutral-dark"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    <ChevronUp size={14} className="rotate-180" />
                  </div>
                  <div className="mt-2 space-y-2">
                    {item.children.map((child) => {
                      const childActive =
                        pathname.includes("/chat") &&
                        child.href.includes(`mode=${activeChatMode}`);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                            childActive
                              ? "bg-blue-light text-blue-primary"
                              : "text-neutral-dark hover:bg-neutral-bg"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-neutral-border p-4">
          <button
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-red-danger transition-colors duration-150 hover:bg-red-light"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-border bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        {/* Overlay backdrop */}
        {moreOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setMoreOpen(false)}
          />
        )}

        {/* Panel "Lainnya" yang muncul ke atas */}
        {moreOpen && (
          <div className="absolute bottom-full left-0 right-0 z-40 mx-2 mb-2 rounded-2xl border border-neutral-border bg-white shadow-lg shadow-slate-200/70">
            <div className="p-2 space-y-1">
              {overflowItems.map((item) => {
                const Icon = item.icon;
                const active = item.href
                  ? isActivePath(pathname, item.href, user.role)
                  : pathname.includes("/chat");

                if (!item.children?.length) {
                  return (
                    <Link
                      key={item.href ?? item.label}
                      href={item.href ?? "/"}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-blue-light text-blue-primary"
                          : "text-neutral-dark hover:bg-neutral-bg"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                // item dengan children (Chat) di overflow — tampilkan flat
                return (
                  <div key={item.label}>
                    <div className="flex items-center gap-3 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-text">
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </div>
                    {item.children.map((child) => {
                      const childActive =
                        pathname.includes("/chat") &&
                        child.href.includes(`mode=${activeChatMode}`);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMoreOpen(false)}
                          className={`flex items-center rounded-xl px-8 py-2.5 text-sm font-medium transition-colors ${
                            childActive
                              ? "bg-blue-light text-blue-primary"
                              : "text-neutral-dark hover:bg-neutral-bg"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}

              {/* Divider + Logout */}
              <div className="border-t border-neutral-border pt-1">
                <button
                  onClick={() => {
                    setMoreOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-danger transition-colors hover:bg-red-light"
                >
                  <LogOut size={18} />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="mx-auto flex w-full max-w-md items-center justify-around gap-1">
          {/* Visible items (maks MAX_VISIBLE - 1) */}
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = item.href
              ? isActivePath(pathname, item.href, user.role)
              : pathname.includes("/chat");

            if (!item.children?.length) {
              return (
                <Link
                  key={item.href ?? item.label}
                  href={item.href ?? "/"}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-blue-light text-blue-primary"
                      : "text-neutral-text hover:bg-neutral-bg"
                  }`}
                >
                  <Icon size={18} />
                  <span className="mt-1 truncate">{item.label}</span>
                </Link>
              );
            }

            // item Chat dengan children (sama seperti kode lama)
            return (
              <div
                key={item.label}
                className="relative flex min-w-0 flex-1 justify-center"
              >
                {mobileChatOpen && (
                  <div className="absolute bottom-full mb-2 flex w-full min-w-36 flex-col gap-2 rounded-2xl border border-neutral-border bg-white p-2 shadow-lg shadow-slate-200/70">
                    {item.children.map((child) => {
                      const childActive =
                        pathname.includes("/chat") &&
                        child.href.includes(`mode=${activeChatMode}`);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileChatOpen(false)}
                          className={`rounded-xl px-3 py-2.5 text-center text-xs font-semibold transition-colors ${
                            childActive
                              ? "bg-blue-light text-blue-primary"
                              : "bg-neutral-bg text-neutral-dark"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setMobileChatOpen((c) => !c)}
                  onBlur={() => setMobileChatOpen(false)}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-blue-light text-blue-primary"
                      : "text-neutral-text hover:bg-neutral-bg"
                  }`}
                >
                  <Icon size={18} />
                  <span className="mt-1 truncate">{item.label}</span>
                  <ChevronUp
                    size={12}
                    className={`mt-1 transition-transform ${mobileChatOpen ? "" : "rotate-180"}`}
                  />
                </button>
              </div>
            );
          })}

          {/* Tombol "Lainnya" — selalu muncul kalau ada overflow */}
          <button
            type="button"
            onClick={() => setMoreOpen((c) => !c)}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
              moreOpen ||
              overflowItems.some(
                (item) =>
                  item.href && isActivePath(pathname, item.href, user.role),
              )
                ? "bg-blue-light text-blue-primary"
                : "text-neutral-text hover:bg-neutral-bg"
            }`}
          >
            <MoreHorizontal size={18} />
            <span className="mt-1">Lainnya</span>
          </button>
        </div>
      </nav>
    </>
  );
}
