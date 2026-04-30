import {
  ReportLevel,
  ReportEscalation,
  REPORT_LEVEL_LABELS,
  REPORT_LEVEL_ORDER,
} from "@/lib/types/report";
import { StatusBadge } from "@/components/ui/Badge";
import {
  Check,
  X,
  ArrowRight,
  Clock,
  Circle,
} from "lucide-react";

interface EscalationTimelineProps {
  escalations: ReportEscalation[];
  currentLevel: ReportLevel;
  currentStatus: string;
}

function StepIcon({ status }: { status: string }) {
  switch (status) {
    case "approved":
      return (
        <div className="w-8 h-8 rounded-full bg-green-action flex items-center justify-center">
          <Check size={16} className="text-white" />
        </div>
      );
    case "rejected":
      return (
        <div className="w-8 h-8 rounded-full bg-red-danger flex items-center justify-center">
          <X size={16} className="text-white" />
        </div>
      );
    case "forwarded":
      return (
        <div className="w-8 h-8 rounded-full bg-blue-primary flex items-center justify-center">
          <ArrowRight size={16} className="text-white" />
        </div>
      );
    case "pending":
      return (
        <div className="w-8 h-8 rounded-full bg-yellow-warning flex items-center justify-center">
          <Clock size={16} className="text-white" />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-neutral-border flex items-center justify-center">
          <Circle size={16} className="text-neutral-text" />
        </div>
      );
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EscalationTimeline({
  escalations,
  currentLevel,
  currentStatus,
}: EscalationTimelineProps) {
  const currentIdx = REPORT_LEVEL_ORDER.indexOf(currentLevel);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-neutral-border p-4">
        <p className="text-xs font-medium text-neutral-text mb-3 uppercase tracking-wide">
          Progres Eskalasi
        </p>
        <div className="flex items-center gap-1">
          {REPORT_LEVEL_ORDER.map((level, idx) => {
            const isActive = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={level} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-full h-2 rounded-full ${
                      isActive ? "bg-blue-primary" : "bg-neutral-border"
                    }`}
                  />
                  <span
                    className={`text-[10px] mt-1.5 font-medium ${
                      isCurrent
                        ? "text-blue-primary font-bold"
                        : isActive
                        ? "text-blue-dark"
                        : "text-neutral-text"
                    }`}
                  >
                    {REPORT_LEVEL_LABELS[level]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {escalations.map((esc, idx) => {
          const isLast = idx === escalations.length - 1;
          return (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <StepIcon status={esc.status} />
                {!isLast && (
                  <div className="w-0.5 flex-1 bg-neutral-border min-h-[24px]" />
                )}
              </div>
              <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">
                    {REPORT_LEVEL_LABELS[esc.from]}
                  </span>
                  <ArrowRight size={14} className="text-neutral-text" />
                  <span className="text-sm font-semibold text-foreground">
                    {REPORT_LEVEL_LABELS[esc.to]}
                  </span>
                  <StatusBadge status={esc.status} />
                </div>
                <p className="text-sm text-neutral-dark mt-1">{esc.note}</p>
                {esc.estimatedBudget != null && (
                  <p className="text-xs text-neutral-text mt-1">
                    Estimasi: Rp {esc.estimatedBudget.toLocaleString("id-ID")}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-text">
                  <span>{formatDate(esc.date)}</span>
                  {esc.respondedBy && (
                    <span>oleh {esc.respondedBy}</span>
                  )}
                </div>
                {esc.rejectionReason && (
                  <div className="mt-2 p-3 bg-red-light rounded-lg border border-red-danger/20">
                    <p className="text-xs font-medium text-red-dark">Alasan penolakan:</p>
                    <p className="text-sm text-red-dark mt-0.5">{esc.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
