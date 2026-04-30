import type { ComponentType } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Wallet,
  Bell,
  Vote,
  ArrowUpRight,
  Users
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import PollVote from "@/components/citizen/PollVote";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import { THREADS } from "@/lib/data/threads";
import { REPORTS } from "@/lib/data/reports";
import { KAS_SUMMARY, KAS_USAGES } from "@/lib/data/kas";
import { USERS } from "@/lib/data/users";
import { REPORT_LEVEL_LABELS } from "@/lib/types/report";
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

function pickLatest(items: Thread[], limit: number): Thread[] {
  return [...items]
    .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt))
    .slice(0, limit);
}

export default function Page() {
  const rtReports = REPORTS.filter((report) => report.currentLevel === "rt" || report.history?.some(h => h.level === "rt"));
  
  const pendingReportCount = rtReports.filter(
    (report) => report.currentStatus === "pending" && report.currentLevel === "rt"
  ).length;
  const approvedReportCount = rtReports.filter(
    (report) => report.currentStatus === "approved"
  ).length;
  const forwardedReportCount = rtReports.filter(
    (report) => report.currentStatus === "forwarded"
  ).length;
  
  const latestReports = [...rtReports]
    .sort((a, b) => toTimestamp(b.updatedAt) - toTimestamp(a.updatedAt))
    .slice(0, 5);

  const announcements = THREADS.filter(
    (thread) => thread.type === "announcement"
  );
  
  const rtResidents = USERS.filter(u => u.role === "citizen");
  const wargaTetap = rtResidents.filter(u => u.status === "tetap").length;
  const wargaKontrak = rtResidents.filter(u => u.status === "kontrak").length;

  const polls = THREADS.filter((thread) => thread.type === "polling");
  const now = Date.now();
  const activePolls = polls.filter((thread) => {
    if (!thread.pollDeadline) return true;
    return toTimestamp(thread.pollDeadline) >= now;
  });

  const totalUsage = KAS_USAGES.reduce((sum, usage) => sum + usage.amount, 0);

  const latestThreads = pickLatest(THREADS, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard RT"
        description="Ringkasan administrasi, pelaporan, dan pengelolaan warga"
        icon={LayoutDashboard}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/rt/reports/new">
              <Button size="sm">
                <FileText size={16} className="mr-2" />
                Buat Pengumuman
              </Button>
            </Link>
            <Link href="/rt/chat">
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
        <div className="absolute -left-12 -bottom-16 h-40 w-40 rounded-full bg-green-limit/30 blur-2xl" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-dark">
              Ringkasan Wilayah RT
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
              Kelola warga dan laporan dengan efisien.
            </h2>
            <p className="mt-2 text-sm text-neutral-dark max-w-xl">
              Pantau laporan masuk dari warga, mutasi warga, hingga saldo kas RT. Kelola semua administrasi wilayah dalam satu dashboard.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/rt/users">
                <Button size="sm" variant="secondary">
                  <Users size={16} className="mr-2" />
                  Data Warga
                </Button>
              </Link>
              <Link href="/rt/reports">
                <Button size="sm" variant="ghost">
                  Cek Laporan
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard
              label="Laporan Pending"
              value={pendingReportCount}
              detail={`Menunggu respon Anda`}
              icon={FileText}
              tone="yellow"
            />
            <MetricCard
              label="Warga Tetap"
              value={wargaTetap}
              detail={`${wargaKontrak} kontrak/kos`}
              icon={Users}
              tone="blue"
            />
            <MetricCard
              label="Saldo Kas"
              value={formatCurrency(KAS_SUMMARY.balance)}
              detail={`Update ${formatDate(KAS_SUMMARY.updatedAt)}`}
              icon={Wallet}
              tone="green"
            />
            <MetricCard
              label="Voting Berjalan"
              value={activePolls.length}
              detail={`${polls.length} polling total`}
              icon={Vote}
              tone="neutral"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Laporan Masuk & Diproses
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Laporan warga terbaru yang membutuhkan perhatian.
                </p>
              </div>
              <Link
                href="/rt/reports"
                className="text-xs font-medium text-blue-primary hover:text-blue-dark"
              >
                Lihat semua laporan
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {latestReports.length === 0 ? (
                <div className="text-sm text-neutral-text">
                  Tidak ada laporan masuk saat ini.
                </div>
              ) : (
                latestReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/rt/reports/${report.id}`}
                    className="block border border-neutral-border rounded-xl p-4 hover:bg-neutral-bg transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {report.title}
                        </p>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <CategoryBadge category={report.category} />
                          <StatusBadge status={report.currentStatus} />
                          <span className="text-xs text-neutral-text">
                            Pelapor: {report.authorName}
                          </span>
                          <span className="text-xs text-neutral-text">
                            · {formatDate(report.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight size={16} className="text-neutral-text mt-1" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Aktivitas & Diskusi
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Diskusi warga terbaru di lingkungan RT.
                </p>
              </div>
              <span className="text-xs text-neutral-text bg-neutral-bg px-2 py-1 rounded-full">
                {latestThreads.length} update
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {latestThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/citizen/threads/${thread.id}`}
                  className="block border border-neutral-border rounded-xl p-4 hover:bg-neutral-bg transition-colors"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-light text-blue-dark">
                      {THREAD_TYPE_LABELS[thread.type]}
                    </span>
                    {thread.isImportant && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-light text-red-dark">
                        Penting
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {thread.title}
                      </p>
                      <p className="text-xs text-neutral-text mt-1">
                        Dibuat oleh {thread.authorName} · {formatDate(thread.createdAt)}
                      </p>
                    </div>
                    <ArrowUpRight size={16} className="text-neutral-text mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Status Rekap Laporan
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Perkembangan laporan yang masuk ke RT.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniStat label="Perlu Aksi (Pending)" value={pendingReportCount} tone="yellow" />
              <MiniStat label="Selesai (Approved)" value={approvedReportCount} tone="green" />
              <MiniStat label="Diteruskan (Forwarded)" value={forwardedReportCount} tone="blue" />
            </div>
          </div>

          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Informasi Kas RT
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Status finansial kas RT terkini.
                </p>
              </div>
              <Link
                href="/rt/kas"
                className="text-xs font-medium text-blue-primary hover:text-blue-dark"
              >
                Atur kas
              </Link>
            </div>

            <div className="mt-4 rounded-xl border border-neutral-border p-4 bg-neutral-bg/60">
              <p className="text-xs text-neutral-text">Saldo saat ini</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatCurrency(KAS_SUMMARY.balance)}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-neutral-text">
                <span>Pemasukan: {formatCurrency(KAS_SUMMARY.monthIncome)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-text">
                <span>Pengeluaran: {formatCurrency(KAS_SUMMARY.monthExpense)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Data Warga
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Komposisi penduduk di wilayah RT.
                </p>
              </div>
              <Link
                href="/rt/users"
                className="text-xs font-medium text-blue-primary hover:text-blue-dark"
              >
                Kelola warga
              </Link>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center border border-neutral-border p-3 rounded-xl">
                <span className="text-sm text-foreground">Total Warga Tetap</span>
                <span className="font-semibold text-foreground">{wargaTetap} KK</span>
              </div>
              <div className="flex justify-between items-center border border-neutral-border p-3 rounded-xl">
                <span className="text-sm text-foreground">Warga Kontrak/Kos</span>
                <span className="font-semibold text-foreground">{wargaKontrak} orang</span>
              </div>
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
