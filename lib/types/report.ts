export type ReportStatus = "pending" | "approved" | "rejected" | "forwarded";
export type ReportCategory = "infrastructure" | "facility" | "safety" | "health" | "other";
export type ReportLevel = "rt" | "rw" | "kelurahan" | "kecamatan" | "pemda";

export interface ReportEscalation {
  from: ReportLevel;
  to: ReportLevel;
  date: string;
  note: string;
  status: ReportStatus;
  respondedBy?: string;
  respondedAt?: string;
  rejectionReason?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  estimatedBudget: number;
  photoUrl?: string;

  // Author
  authorId: string;
  authorNik?: string;
  authorName: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;

  // Tracking Status
  currentLevel: ReportLevel;
  currentStatus: ReportStatus;
  escalations: ReportEscalation[];

  // Deadline (??? days per level)
  deadlineAt: string;

  createdAt: string;
  updatedAt: string;
}

export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  infrastructure: "Infrastruktur",
  facility: "Fasilitas Umum",
  safety: "Keamanan",
  health: "Kesehatan",
  other: "Lainnya",
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
  forwarded: "Diteruskan",
};

export const REPORT_LEVEL_LABELS: Record<ReportLevel, string> = {
  rt: "RT",
  rw: "RW",
  kelurahan: "Kelurahan",
  kecamatan: "Kecamatan",
  pemda: "Pemerintah Daerah",
};

export const REPORT_LEVEL_ORDER: ReportLevel[] = [
  "rt", "rw", "kelurahan", "kecamatan", "pemda",
];
