"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Inbox, ArrowUpRight, Clock, CheckCircle, XCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import { REPORTS } from "@/lib/data/reports";
import { REPORT_LEVEL_LABELS } from "@/lib/types/report";
import type { ReportStatus } from "@/lib/types/report";

type Tab = "incoming" | "official";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
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

export default function RTReportsPage() {
  const [tab, setTab] = useState<Tab>("incoming");
  const incomingReports = REPORTS.filter((r) => r.authorId.startsWith("w-"));
  const officialReports = REPORTS.filter((r) => r.estimatedBudget != null);

  const pendingCount = incomingReports.filter(
    (r) => r.currentStatus === "pending"
  ).length;

  return (
    <div>
      <PageHeader
        title="Laporan"
        description="Kelola laporan dari warga dan laporan resmi berjenjang"
        icon={FileText}
      />
      <div className="flex gap-1 mb-5 bg-neutral-bg rounded-xl p-1 max-w-md">
        <button
          onClick={() => setTab("incoming")}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "incoming"
              ? "bg-white text-foreground shadow-sm"
              : "text-neutral-text hover:text-neutral-dark"
          }`}
        >
          <Inbox size={14} className="inline mr-1.5 -mt-0.5" />
          Masuk dari Warga
          {pendingCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-danger text-white">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("official")}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "official"
              ? "bg-white text-foreground shadow-sm"
              : "text-neutral-text hover:text-neutral-dark"
          }`}
        >
          <ArrowUpRight size={14} className="inline mr-1.5 -mt-0.5" />
          Laporan Resmi
        </button>
      </div>
      {tab === "incoming" && (
        <div className="space-y-3">
          {incomingReports.length === 0 ? (
            <EmptyState text="Belum ada laporan masuk" />
          ) : (
            incomingReports.map((report) => (
              <Link
                key={report.id}
                href={`/rt/reports/${report.id}`}
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
                        dari {report.authorName}
                      </span>
                      <span className="text-xs text-neutral-text">
                        · {formatDate(report.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-neutral-text shrink-0 mt-1" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
      {tab === "official" && (
        <div className="space-y-3">
          {officialReports.length === 0 ? (
            <EmptyState text="Belum ada laporan resmi" />
          ) : (
            officialReports.map((report) => (
              <Link
                key={report.id}
                href={`/rt/reports/${report.id}`}
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
                        · {formatCurrency(report.estimatedBudget!)}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-neutral-text shrink-0 mt-1" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileText size={48} className="text-neutral-border mb-4" />
      <p className="text-neutral-text text-sm">{text}</p>
    </div>
  );
}
