"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import EscalationTimeline from "@/components/report/EscalationTimeline";
import Button from "@/components/ui/Button";
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

function formatCurrency(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function PemdaReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const report = REPORTS.find((r) => r.id === id);

  const [action, setAction] = useState<"" | "approve" | "reject">("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  if (!report) {
    return (
      <div>
        <PageHeader title="Laporan Tidak Ditemukan" backHref="/pemda/reports" />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText size={48} className="text-neutral-border mb-4" />
          <p className="text-neutral-text text-sm">Laporan tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  const canAct = report.currentLevel === "pemda" && report.currentStatus === "pending";

  function handleSubmitAction() {
    setDone(true);
    setTimeout(() => router.push("/pemda/reports"), 2000);
  }

  if (done) {
    const labels = { approve: "disetujui", reject: "ditolak" };
    return (
      <div>
        <PageHeader title="Detail Laporan" backHref="/pemda/reports" />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center mb-4">
            <FileText size={32} className="text-green-action" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Berhasil</h2>
          <p className="text-sm text-neutral-text">Laporan telah {labels[action as keyof typeof labels]}.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Detail Laporan" backHref="/pemda/reports" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Report info */}
        <div className="rounded-xl border border-neutral-border bg-white p-4 sm:p-5">
          <h2 className="text-lg font-bold text-foreground mb-2">{report.title}</h2>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <CategoryBadge category={report.category} />
            <StatusBadge status={report.currentStatus} />
            {report.estimatedBudget != null && (
              <span className="text-xs font-medium text-green-dark bg-green-light px-2 py-1 rounded-lg">
                {formatCurrency(report.estimatedBudget)}
              </span>
            )}
            <span className="text-xs text-neutral-text">dari Kec. {report.kecamatan}</span>
          </div>
          <p className="text-sm text-neutral-dark leading-relaxed">{report.description}</p>
          <p className="text-xs text-neutral-text mt-3">{formatDate(report.createdAt)}</p>
        </div>

        {/* Escalation timeline */}
        <div className="rounded-xl border border-neutral-border bg-white p-4 sm:p-5">
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

      {/* Action */}
      {canAct && (
        <div className="mt-4 rounded-xl border border-neutral-border bg-white p-4 sm:p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Keputusan</h3>

          {!action && (
            <div className="space-y-3">
              <div className="p-3 bg-yellow-light rounded-lg border border-yellow-warning/20">
                <p className="text-sm text-yellow-dark">
                  Anda adalah <strong>level terakhir</strong>. Keputusan Anda bersifat final untuk laporan ini.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="sm" variant="primary" onClick={() => setAction("approve")} className="w-full sm:w-auto">
                  Setujui & Alokasikan Anggaran
                </Button>
                <Button size="sm" variant="danger" onClick={() => setAction("reject")} className="w-full sm:w-auto">
                  Tolak
                </Button>
              </div>
            </div>
          )}

          {action === "approve" && (
            <div className="space-y-4">
              <div className="p-3 bg-green-light rounded-lg border border-green-action/20">
                <p className="text-sm text-green-dark">
                  Anggaran sebesar <strong>{formatCurrency(report.estimatedBudget ?? 0)}</strong> akan dialokasikan untuk laporan ini.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-dark">Catatan Persetujuan</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Masuk jadwal perbaikan Q2 2026..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 text-base rounded-xl border bg-white text-foreground placeholder:text-neutral-text/50 border-neutral-border focus:outline-none focus:ring-2 focus:ring-blue-border focus:border-blue-primary resize-none"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="sm" onClick={handleSubmitAction} className="w-full sm:w-auto">Setujui Laporan</Button>
                <Button size="sm" variant="ghost" onClick={() => setAction("")} className="w-full sm:w-auto">Batal</Button>
              </div>
            </div>
          )}

          {action === "reject" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-dark">Alasan Penolakan</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan alasan penolakan..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-base rounded-xl border bg-white text-foreground placeholder:text-neutral-text/50 border-neutral-border focus:outline-none focus:ring-2 focus:ring-blue-border focus:border-blue-primary resize-none"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="sm" variant="danger" onClick={handleSubmitAction} disabled={!note} className="w-full sm:w-auto">Tolak Laporan</Button>
                <Button size="sm" variant="ghost" onClick={() => setAction("")} className="w-full sm:w-auto">Batal</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
