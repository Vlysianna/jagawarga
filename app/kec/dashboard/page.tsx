import Link from "next/link";
import { Clock, CheckCircle, XCircle, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { REPORTS } from "@/lib/data/reports";
import { REPORT_LEVEL_LABELS } from "@/lib/types/report";

export default function KelDashboardPage() {
  const allReports = REPORTS.filter((r) => {
    if (r.estimatedBudget == null) return false;
    return r.escalations.some((e) => e.from === "rw" && e.to === "kel") || r.currentLevel === "kel";
  });

  const pending = allReports.filter((r) => r.currentLevel === "kel" && r.currentStatus === "pending").length;
  const forwarded = allReports.filter((r) => r.escalations.some((e) => e.from === "kel" && e.to === "kec")).length;
  const rejected = allReports.filter((r) => r.currentStatus === "rejected").length;
  const total = allReports.length;

  const recent = [...allReports]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard Kecamatan"
        description="Ringkasan laporan yang masuk dari RW"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" count={total} icon={ArrowUpRight} color="blue" />
        <StatCard label="Pending" count={pending} icon={Clock} color="yellow" />
        <StatCard label="Diteruskan" count={forwarded} icon={ArrowUpRight} color="green" />
        <StatCard label="Ditolak" count={rejected} icon={XCircle} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-neutral-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Laporan Terbaru</h3>
          <Link href="/kel/reports" className="text-xs text-blue-primary hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div className="space-y-3">
          {recent.map((r) => (
            <Link
              key={r.id}
              href={`/kel/reports/${r.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-bg transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                <p className="text-xs text-neutral-text mt-0.5">
                  di {REPORT_LEVEL_LABELS[r.currentLevel]}
                </p>
              </div>
              <StatusDot status={r.currentStatus} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  count,
  icon: Icon,
  color,
}: {
  label: string;
  count: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: "yellow" | "blue" | "green" | "red";
}) {
  const colors = {
    yellow: "bg-yellow-light text-yellow-dark border-yellow-warning/20",
    blue: "bg-blue-light text-blue-dark border-blue-border",
    green: "bg-green-light text-green-dark border-green-action/20",
    red: "bg-red-light text-red-danger border-red-danger/20",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-warning",
    forwarded: "bg-blue-primary",
    approved: "bg-green-action",
    rejected: "bg-red-danger",
  };
  return <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors[status] ?? "bg-neutral-text"}`} />;
}
