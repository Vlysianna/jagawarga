import {
  ReportStatus,
  ReportCategory,
  REPORT_STATUS_LABELS,
  REPORT_CATEGORY_LABELS,
} from "@/lib/types/report";

type BadgeVariant = "status" | "category";

interface StatusBadgeProps {
  status: ReportStatus;
}

interface CategoryBadgeProps {
  category: ReportCategory;
}

const STATUS_STYLES: Record<ReportStatus, string> = {
  pending: "bg-yellow-light text-yellow-dark border-yellow-warning/30",
  approved: "bg-green-light text-green-dark border-green-action/30",
  rejected: "bg-red-light text-red-dark border-red-danger/30",
  forwarded: "bg-blue-light text-blue-dark border-blue-border",
};

const CATEGORY_STYLES: Record<ReportCategory, string> = {
  infrastructure: "bg-blue-light text-blue-dark",
  facility: "bg-green-light text-green-dark",
  safety: "bg-red-light text-red-dark",
  health: "bg-yellow-light text-yellow-dark",
  other: "bg-neutral-bg text-neutral-dark",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_STYLES[status]}`}
    >
      {REPORT_STATUS_LABELS[status]}
    </span>
  );
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${CATEGORY_STYLES[category]}`}
    >
      {REPORT_CATEGORY_LABELS[category]}
    </span>
  );
}
