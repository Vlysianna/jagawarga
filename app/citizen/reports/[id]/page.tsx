"use client";

import { use } from "react";
import { FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import EscalationTimeline from "@/components/report/EscalationTimeline";
import { REPORTS } from "@/lib/data/reports";
import { REPORT_LEVEL_LABELS } from "@/lib/types/report";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CitizenReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const report = REPORTS.find((r) => r.id === id);

  if (!report) {
    return (
      <div>
        <PageHeader title="Laporan Tidak Ditemukan" backHref="/citizen/reports" />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText size={48} className="text-neutral-border mb-4" />
          <p className="text-neutral-text text-sm">
            Laporan dengan ID &quot;{id}&quot; tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Detail Laporan" backHref="/citizen/reports" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Report info */}
        <div className="bg-white rounded-xl border border-neutral-border p-5">
          <h2 className="text-lg font-bold text-foreground mb-3">{report.title}</h2>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <CategoryBadge category={report.category} />
            <StatusBadge status={report.currentStatus} />
            <span className="text-xs text-neutral-text">
              Posisi: {REPORT_LEVEL_LABELS[report.currentLevel]}
            </span>
          </div>
          <p className="text-sm text-neutral-dark leading-relaxed">
            {report.description}
          </p>
          {report.estimatedBudget != null && (
            <p className="text-sm text-green-dark font-medium mt-3">
              Estimasi: Rp {report.estimatedBudget.toLocaleString("id-ID")}
            </p>
          )}
          <p className="text-xs text-neutral-text mt-3">
            Dilaporkan pada {formatDate(report.createdAt)}
          </p>
        </div>

        {/* Escalation timeline */}
        <div className="bg-white rounded-xl border border-neutral-border p-5">
          {report.escalations.length > 0 ? (
            <>
              <h3 className="text-sm font-bold text-foreground mb-4">Riwayat Eskalasi</h3>
              <EscalationTimeline
                escalations={report.escalations}
                currentLevel={report.currentLevel}
                currentStatus={report.currentStatus}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-neutral-text">Belum ada riwayat eskalasi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
