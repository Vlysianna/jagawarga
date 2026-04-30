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
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import PollVote from "@/components/citizen/PollVote";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import { THREADS } from "@/lib/data/threads";
import { REPORTS } from "@/lib/data/reports";
import { KAS_SUMMARY, KAS_USAGES } from "@/lib/data/kas";
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
  const citizenReports = REPORTS.filter((report) =>
    report.authorId.startsWith("w-")
  );
  const activeReportCount = citizenReports.filter((report) =>
    ["pending", "forwarded"].includes(report.currentStatus)
  ).length;
  const approvedReportCount = citizenReports.filter(
    (report) => report.currentStatus === "approved"
  ).length;
  const rejectedReportCount = citizenReports.filter(
    (report) => report.currentStatus === "rejected"
  ).length;
  const latestReports = [...citizenReports]
    .sort((a, b) => toTimestamp(b.updatedAt) - toTimestamp(a.updatedAt))
    .slice(0, 3);

  const announcements = THREADS.filter(
    (thread) => thread.type === "announcement"
  );
  const importantAnnouncements = announcements.filter(
    (thread) => thread.isImportant
  );
  const latestAnnouncements = pickLatest(
    importantAnnouncements.length > 0
      ? importantAnnouncements
      : announcements,
    3
  );

  const polls = THREADS.filter((thread) => thread.type === "polling");
  const now = Date.now();
  const activePolls = polls.filter((thread) => {
    if (!thread.pollDeadline) return true;
    return toTimestamp(thread.pollDeadline) >= now;
  });
  const featuredPoll = pickLatest(activePolls, 1)[0];

  const totalUsage = KAS_USAGES.reduce((sum, usage) => sum + usage.amount, 0);
  const latestUsage = [...KAS_USAGES]
    .sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date))
    .slice(0, 3);

  const latestThreads = pickLatest(THREADS, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Warga"
        description="Ringkasan aktivitas RT/RW dan layanan cepat warga"
        icon={LayoutDashboard}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/citizen/reports/new">
              <Button size="sm">
                <FileText size={16} className="mr-2" />
                Buat Laporan
              </Button>
            </Link>
            <Link href="/citizen/chat">
              <Button size="sm" variant="secondary">
                <MessageSquare size={16} className="mr-2" />
                Buka Chat
              </Button>
            </Link>
          </div>
        }
      />

      <section className="relative overflow-hidden rounded-2xl border border-neutral-border bg-gradient-to-br from-blue-light via-white to-yellow-light p-5 sm:p-6">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-border/40 blur-2xl" />
        <div className="absolute -left-12 -bottom-16 h-40 w-40 rounded-full bg-yellow-light/70 blur-2xl" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-dark">
              Ringkasan Hari Ini
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground">
              Warga terhubung, laporan tertata, kas transparan.
            </h2>
            <p className="mt-2 text-sm text-neutral-dark max-w-xl">
              Pantau pengumuman RT, voting warga, hingga progres laporan di
              satu tempat. Semua data diperbarui dari aktivitas lingkungan
              terbaru.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/citizen/kas">
                <Button size="sm" variant="secondary">
                  <Wallet size={16} className="mr-2" />
                  Lihat Kas RT
                </Button>
              </Link>
              <Link href="/citizen/reports">
                <Button size="sm" variant="ghost">
                  Lacak Laporan Saya
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard
              label="Saldo Kas"
              value={formatCurrency(KAS_SUMMARY.balance)}
              detail={`Update ${formatDate(KAS_SUMMARY.updatedAt)}`}
              icon={Wallet}
              tone="blue"
            />
            <MetricCard
              label="Laporan Aktif"
              value={activeReportCount}
              detail={`${approvedReportCount} disetujui`}
              icon={FileText}
              tone="green"
            />
            <MetricCard
              label="Pengumuman"
              value={importantAnnouncements.length}
              detail={`${announcements.length} total info`}
              icon={Bell}
              tone="yellow"
            />
            <MetricCard
              label="Voting Berjalan"
              value={activePolls.length}
              detail={`${polls.length} polling`}
              icon={Vote}
              tone="neutral"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Aktivitas Lingkungan
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Pengumuman, diskusi, dan polling terbaru RT/RW.
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
                    <span className="text-xs text-neutral-text">
                      RT {thread.rt} / RW {thread.rw}
                    </span>
                  </div>
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {thread.title}
                      </p>
                      <p className="text-xs text-neutral-text mt-1">
                        Oleh {thread.authorName} · {formatDate(thread.createdAt)}
                      </p>
                    </div>
                    <ArrowUpRight size={16} className="text-neutral-text mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Laporan Saya
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Ringkasan laporan warga dan status terakhirnya.
                </p>
              </div>
              <Link
                href="/citizen/reports"
                className="text-xs font-medium text-blue-primary hover:text-blue-dark"
              >
                Lihat semua
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {latestReports.length === 0 ? (
                <div className="text-sm text-neutral-text">
                  Belum ada laporan yang dikirim.
                </div>
              ) : (
                latestReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/citizen/reports/${report.id}`}
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
                            di {REPORT_LEVEL_LABELS[report.currentLevel]}
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
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Voting Warga
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Beri suara untuk keputusan RT/RW.
                </p>
              </div>
              <span className="text-xs text-neutral-text bg-neutral-bg px-2 py-1 rounded-full">
                {activePolls.length} aktif
              </span>
            </div>

            {featuredPoll && featuredPoll.pollOptions ? (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {featuredPoll.title}
                  </p>
                  <p className="text-xs text-neutral-text mt-1">
                    Deadline: {formatDate(featuredPoll.pollDeadline)}
                  </p>
                </div>
                <PollVote
                  options={featuredPoll.pollOptions}
                  deadline={featuredPoll.pollDeadline}
                />
                <Link
                  href={`/citizen/threads/${featuredPoll.id}`}
                  className="text-xs font-medium text-blue-primary hover:text-blue-dark"
                >
                  Lihat detail polling
                </Link>
              </div>
            ) : (
              <p className="mt-4 text-sm text-neutral-text">
                Belum ada polling aktif saat ini.
              </p>
            )}
          </div>

          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Ringkasan Kas RT
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Transparansi pembelanjaan terbaru.
                </p>
              </div>
              <Link
                href="/citizen/kas"
                className="text-xs font-medium text-blue-primary hover:text-blue-dark"
              >
                Lihat kas lengkap
              </Link>
            </div>

            <div className="mt-4 rounded-xl border border-neutral-border p-4 bg-neutral-bg/60">
              <p className="text-xs text-neutral-text">Saldo saat ini</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatCurrency(KAS_SUMMARY.balance)}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-neutral-text">
                <span>Masuk: {formatCurrency(KAS_SUMMARY.monthIncome)}</span>
                <span>Keluar: {formatCurrency(KAS_SUMMARY.monthExpense)}</span>
              </div>
              <p className="mt-2 text-xs text-neutral-text">
                Total terpakai: {formatCurrency(totalUsage)}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {latestUsage.map((usage) => (
                <div
                  key={usage.id}
                  className="flex items-start justify-between gap-3 border border-neutral-border rounded-xl p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {usage.title}
                    </p>
                    <p className="text-xs text-neutral-text mt-1">
                      {formatDate(usage.date)} · {usage.vendor}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(usage.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Pengumuman Penting
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Info kritis yang perlu segera diketahui warga.
                </p>
              </div>
              <span className="text-xs text-neutral-text bg-neutral-bg px-2 py-1 rounded-full">
                {importantAnnouncements.length} penting
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {latestAnnouncements.length === 0 ? (
                <p className="text-sm text-neutral-text">
                  Belum ada pengumuman penting.
                </p>
              ) : (
                latestAnnouncements.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/citizen/threads/${thread.id}`}
                    className="block border border-neutral-border rounded-xl p-3 hover:bg-neutral-bg transition-colors"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {thread.title}
                    </p>
                    <p className="text-xs text-neutral-text mt-1">
                      {THREAD_TYPE_LABELS[thread.type]} · {formatDate(thread.createdAt)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-neutral-border rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Status Laporan Warga
                </h3>
                <p className="text-sm text-neutral-text mt-1">
                  Rekap status laporan untuk warga.
                </p>
              </div>
              <Link
                href="/citizen/reports"
                className="text-xs font-medium text-blue-primary hover:text-blue-dark"
              >
                Pantau laporan
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Aktif" value={activeReportCount} tone="yellow" />
              <MiniStat label="Disetujui" value={approvedReportCount} tone="green" />
              <MiniStat label="Ditolak" value={rejectedReportCount} tone="red" />
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
  tone: "yellow" | "green" | "red";
}) {
  const toneStyles: Record<typeof tone, string> = {
    yellow: "bg-yellow-light text-yellow-dark border-yellow-warning/20",
    green: "bg-green-light text-green-dark border-green-action/20",
    red: "bg-red-light text-red-dark border-red-danger/20",
  };

  return (
    <div className={`rounded-xl border p-4 ${toneStyles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}
