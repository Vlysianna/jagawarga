"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { CategoryBadge, StatusBadge } from "@/components/ui/Badge";
import { REPORTS } from "@/lib/data/reports";
import { THREADS } from "@/lib/data/threads";
import { getAuthUser } from "@/lib/utils/auth";
import { isWithinScope } from "@/lib/utils/scope";
import {
  getVisibleElderlyUsers,
  getVisibleManagedUsers,
} from "@/lib/utils/user-management";
import { readElderlyVisits, readUsers } from "@/lib/utils/user-store";
import { ElderlyVisitSchedule, User } from "@/lib/types/user";
import { THREAD_TYPE_LABELS, Thread } from "@/lib/types/thread";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function toTimestamp(value?: string): number {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pickLatestThreads(items: Thread[], limit: number): Thread[] {
  return [...items]
    .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt))
    .slice(0, limit);
}

function visitStatusLabel(status: ElderlyVisitSchedule["status"]): string {
  switch (status) {
    case "completed":
      return "Selesai";
    case "cancelled":
      return "Dibatalkan";
    default:
      return "Terjadwal";
  }
}

export default function Page() {
  const authUser = getAuthUser();
  const [users] = useState<User[]>(() => readUsers());
  const [visits] = useState<ElderlyVisitSchedule[]>(() => readElderlyVisits());

  const dashboardData = useMemo(() => {
    if (!authUser) return null;

    const rtUsers = getVisibleManagedUsers(users, authUser).sort((a, b) =>
      a.name.localeCompare(b.name, "id-ID")
    );
    const citizenUsers = users.filter(
      (user) =>
        user.role === "citizen" && isWithinScope(user.scope_id, authUser.scope_id)
    );
    const elderlyUsers = getVisibleElderlyUsers(users, authUser).sort(
      (a, b) => (b.age ?? 0) - (a.age ?? 0)
    );
    const rwReports = REPORTS.filter(
      (report) =>
        report.rw === authUser.detail.rw &&
        (report.currentLevel === "rw" ||
          report.escalations.some(
            (escalation) => escalation.from === "rt" && escalation.to === "rw"
          ))
    );
    const pendingReportCount = rwReports.filter(
      (report) =>
        report.currentStatus === "pending" && report.currentLevel === "rw"
    ).length;
    const approvedReportCount = rwReports.filter(
      (report) => report.currentStatus === "approved"
    ).length;
    const forwardedReportCount = rwReports.filter(
      (report) => report.currentStatus === "forwarded"
    ).length;
    const latestReports = [...rwReports]
      .sort((a, b) => toTimestamp(b.updatedAt) - toTimestamp(a.updatedAt))
      .slice(0, 5);
    const totalBudget = rwReports.reduce(
      (sum, report) => sum + (report.estimatedBudget ?? 0),
      0
    );
    const latestThreads = pickLatestThreads(
      THREADS.filter(
        (thread) =>
          thread.rw === authUser.detail.rw ||
          thread.rt === authUser.detail.rt
      ),
      4
    );

    const visitsByUser = new Map<string, ElderlyVisitSchedule[]>();
    for (const visit of visits) {
      visitsByUser.set(visit.userId, [
        ...(visitsByUser.get(visit.userId) ?? []),
        visit,
      ]);
    }

    const elderlyHighlights = elderlyUsers.slice(0, 3).map((user) => {
      const userVisits = [...(visitsByUser.get(user.id) ?? [])].sort(
        (a, b) => toTimestamp(a.scheduledAt) - toTimestamp(b.scheduledAt)
      );

      return {
        user,
        nextVisit:
          userVisits.find((visit) => visit.status === "planned") ??
          userVisits[0] ??
          null,
      };
    });

    return {
      rtUsers,
      citizenUsers,
      elderlyUsers,
      rwReports,
      pendingReportCount,
      approvedReportCount,
      forwardedReportCount,
      latestReports,
      totalBudget,
      latestThreads,
      elderlyHighlights,
    };
  }, [authUser, users, visits]);

  if (!authUser || !dashboardData) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard RW"
        description="Ringkasan koordinasi RT, laporan resmi, dan data warga"
        icon={LayoutDashboard}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/rw/reports">
              <Button size="sm">
                <FileText size={16} className="mr-2" />
                Tinjau Laporan
              </Button>
            </Link>
            <Link href="/rw/chat">
              <Button size="sm" variant="secondary">
                <MessageSquare size={16} className="mr-2" />
                Buka Chat
              </Button>
            </Link>
          </div>
        }
      />

      <section className="relative overflow-hidden rounded-2xl border border-neutral-border bg-gradient-to-br from-blue-light via-white to-green-light p-5 sm:p-6">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-border/40 blur-2xl" />
        <div className="absolute -left-12 -bottom-16 h-40 w-40 rounded-full bg-green-light/50 blur-2xl" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-dark">
              Ringkasan Wilayah RW
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Koordinasi RT dan laporan resmi lebih terpantau.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-dark">
              Pantau laporan dari RT, data warga lintas RT, dan warga lansia
              yang perlu pendampingan dari satu dashboard RW.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/rw/users">
                <Button size="sm" variant="secondary">
                  <Users size={16} className="mr-2" />
                  Data RT
                </Button>
              </Link>
              <Link href="/rw/reports">
                <Button size="sm" variant="ghost">
                  Cek Laporan
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard
              label="Laporan Pending"
              value={dashboardData.pendingReportCount}
              detail="Menunggu respon RW"
              icon={FileText}
              tone="yellow"
            />
            <MetricCard
              label="RT Aktif"
              value={dashboardData.rtUsers.length}
              detail={`${dashboardData.citizenUsers.length} warga tercatat`}
              icon={ShieldCheck}
              tone="blue"
            />
            <MetricCard
              label="Warga Lansia"
              value={dashboardData.elderlyUsers.length}
              detail={`${dashboardData.elderlyHighlights.filter((item) => item.nextVisit).length} punya jadwal`}
              icon={HeartHandshake}
              tone="green"
            />
            <MetricCard
              label="Total Anggaran"
              value={formatCurrency(dashboardData.totalBudget)}
              detail={`${dashboardData.forwardedReportCount} laporan diteruskan`}
              icon={ArrowUpRight}
              tone="neutral"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-border bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Laporan RT Masuk & Diproses
                </h3>
                <p className="mt-1 text-sm text-neutral-text">
                  Laporan resmi terbaru yang membutuhkan perhatian RW.
                </p>
              </div>
              <Link
                href="/rw/reports"
                className="text-xs font-medium text-blue-primary hover:text-blue-dark"
              >
                Lihat semua laporan
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {dashboardData.latestReports.length === 0 ? (
                <div className="text-sm text-neutral-text">
                  Tidak ada laporan masuk saat ini.
                </div>
              ) : (
                dashboardData.latestReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/rw/reports/${report.id}`}
                    className="block rounded-xl border border-neutral-border p-4 transition-colors hover:bg-neutral-bg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {report.title}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <CategoryBadge category={report.category} />
                          <StatusBadge status={report.currentStatus} />
                          <span className="text-xs text-neutral-text">
                            RT {report.rt}
                          </span>
                          <span className="text-xs text-neutral-text">
                            · {formatDate(report.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight size={16} className="mt-1 text-neutral-text" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Aktivitas & Diskusi
                </h3>
                <p className="mt-1 text-sm text-neutral-text">
                  Diskusi dan pengumuman terbaru di wilayah RW.
                </p>
              </div>
              <span className="rounded-full bg-neutral-bg px-2 py-1 text-xs text-neutral-text">
                {dashboardData.latestThreads.length} update
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {dashboardData.latestThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/citizen/threads/${thread.id}`}
                  className="block rounded-xl border border-neutral-border p-4 transition-colors hover:bg-neutral-bg"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-light px-2 py-1 text-xs font-medium text-blue-dark">
                      {THREAD_TYPE_LABELS[thread.type]}
                    </span>
                    {thread.isImportant && (
                      <span className="rounded-full bg-red-light px-2 py-1 text-xs font-medium text-red-dark">
                        Penting
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {thread.title}
                      </p>
                      <p className="mt-1 text-xs text-neutral-text">
                        Dibuat oleh {thread.authorName} · {formatDate(thread.createdAt)}
                      </p>
                    </div>
                    <ArrowUpRight size={16} className="mt-1 text-neutral-text" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-border bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Status Rekap Laporan
                </h3>
                <p className="mt-1 text-sm text-neutral-text">
                  Perkembangan laporan yang masuk ke RW.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniStat
                label="Perlu Aksi"
                value={dashboardData.pendingReportCount}
                tone="yellow"
              />
              <MiniStat
                label="Selesai"
                value={dashboardData.approvedReportCount}
                tone="green"
              />
              <MiniStat
                label="Diteruskan"
                value={dashboardData.forwardedReportCount}
                tone="blue"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Data RT
                </h3>
                <p className="mt-1 text-sm text-neutral-text">
                  Komposisi RT dan warga di bawah RW.
                </p>
              </div>
              <Link
                href="/rw/users"
                className="text-xs font-medium text-blue-primary hover:text-blue-dark"
              >
                Kelola RT
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              <InfoRow label="Total RT Aktif" value={`${dashboardData.rtUsers.length} RT`} />
              <InfoRow
                label="Total Warga"
                value={`${dashboardData.citizenUsers.length} orang`}
              />
              <InfoRow
                label="Warga Lansia"
                value={`${dashboardData.elderlyUsers.length} orang`}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Pantauan Lansia
                </h3>
                <p className="mt-1 text-sm text-neutral-text">
                  Jadwal kunjungan lansia di wilayah RW.
                </p>
              </div>
              <Link
                href="/rw/lansia"
                className="text-xs font-medium text-blue-primary hover:text-blue-dark"
              >
                Daftar lansia
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {dashboardData.elderlyHighlights.length === 0 ? (
                <div className="text-sm text-neutral-text">
                  Belum ada data lansia di wilayah RW ini.
                </div>
              ) : (
                dashboardData.elderlyHighlights.map((item) => (
                  <div
                    key={item.user.id}
                    className="rounded-xl border border-neutral-border p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {item.user.name}
                      </p>
                      <span className="rounded-full bg-yellow-light px-2 py-1 text-[11px] font-semibold text-yellow-dark">
                        {item.user.age ? `${item.user.age} tahun` : "Lansia"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-text">
                      RT {item.user.detail.rt || "-"} · {item.user.phone}
                    </p>
                    {item.nextVisit ? (
                      <p className="mt-2 text-xs text-neutral-text">
                        {visitStatusLabel(item.nextVisit.status)} ·{" "}
                        {formatDateTime(item.nextVisit.scheduledAt)}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-neutral-text">
                        Belum ada jadwal kunjungan.
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone: "blue" | "green" | "yellow" | "neutral";
}) {
  const toneStyles: Record<typeof tone, string> = {
    blue: "border-blue-border bg-white/80 text-blue-dark",
    green: "border-green-action/20 bg-white/80 text-green-dark",
    yellow: "border-yellow-warning/30 bg-white/80 text-yellow-dark",
    neutral: "border-neutral-border bg-white/80 text-neutral-dark",
  };

  return (
    <div className={`rounded-xl border p-4 ${toneStyles[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <Icon size={16} />
        {label}
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-neutral-text">{detail}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "yellow" | "green" | "red" | "blue";
}) {
  const toneStyles: Record<typeof tone, string> = {
    yellow: "bg-yellow-light text-yellow-dark border-yellow-warning/20",
    green: "bg-green-light text-green-dark border-green-action/20",
    red: "bg-red-light text-red-dark border-red-danger/20",
    blue: "bg-blue-light text-blue-dark border-blue-border/20",
  };

  return (
    <div className={`rounded-xl border p-4 ${toneStyles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-border p-3">
      <span className="text-sm text-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
