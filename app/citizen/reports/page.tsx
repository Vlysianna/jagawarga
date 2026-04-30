"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Clock, CheckCircle, XCircle, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import { REPORTS } from "@/lib/data/reports";
import { REPORT_LEVEL_LABELS } from "@/lib/types/report";
import type { ReportStatus } from "@/lib/types/report";

type FilterStatus = "all" | ReportStatus;

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "forwarded", label: "Diteruskan" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusIcon({ status }: { status: ReportStatus }) {
  switch (status) {
    case "pending":
      return <Clock size={16} className="text-yellow-warning" />;
    case "approved":
      return <CheckCircle size={16} className="text-green-action" />;
    case "rejected":
      return <XCircle size={16} className="text-red-danger" />;
    case "forwarded":
      return <ArrowUpRight size={16} className="text-blue-primary" />;
  }
}

export default function CitizenReportsPage() {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const myReports = REPORTS.filter((r) => r.authorId.startsWith("w-"));
  const filtered =
    filter === "all"
      ? myReports
      : myReports.filter((r) => r.currentStatus === filter);

  return (
    <div>
      <PageHeader
        title="Laporan Saya"
        description="Kirim laporan ke RT dan pantau statusnya"
        icon={FileText}
        actions={
          <Link href="/citizen/reports/new">
            <Button size="sm">
              <Plus size={16} className="mr-2" />
              Buat Laporan
            </Button>
          </Link>
        }
      />

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              filter === f.value
                ? "bg-blue-primary text-white"
                : "bg-white text-neutral-dark border border-neutral-border hover:bg-neutral-bg"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Report list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText size={48} className="text-neutral-border mb-4" />
          <p className="text-neutral-text text-sm">Tidak ada laporan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => (
            <Link
              key={report.id}
              href={`/citizen/reports/${report.id}`}
              className="block bg-white rounded-xl border border-neutral-border p-4 hover:border-blue-border hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusIcon status={report.currentStatus} />
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {report.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CategoryBadge category={report.category} />
                    <StatusBadge status={report.currentStatus} />
                    <span className="text-xs text-neutral-text">
                      di {REPORT_LEVEL_LABELS[report.currentLevel]}
                    </span>
                    <span className="text-xs text-neutral-text">
                      · {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-neutral-text shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
