export type ContributionStatus = "paid" | "unpaid" | "partial" | "overdue";

export type KasCategory =
  | "kebersihan"
  | "keamanan"
  | "sosial"
  | "infrastruktur"
  | "administrasi"
  | "darurat"
  | "lainnya";

export interface KasSummary {
  balance: number;
  monthIncome: number;
  monthExpense: number;
  targetMonthly: number;
  updatedAt: string;
}

export interface KasContribution {
  id: string;
  residentName: string;
  rt: string;
  rw: string;
  amount: number;
  month: string;
  status: ContributionStatus;
  paidAt?: string;
  method?: string;
  note?: string;
}

export interface KasUsage {
  id: string;
  title: string;
  category: KasCategory;
  amount: number;
  date: string;
  vendor: string;
  approvedBy: string;
  note?: string;
}

export const CONTRIBUTION_STATUS_LABELS: Record<ContributionStatus, string> = {
  paid: "Lunas",
  unpaid: "Belum bayar",
  partial: "Cicilan",
  overdue: "Terlambat",
};

export const KAS_CATEGORY_LABELS: Record<KasCategory, string> = {
  kebersihan: "Kebersihan",
  keamanan: "Keamanan",
  sosial: "Sosial",
  infrastruktur: "Infrastruktur",
  administrasi: "Administrasi",
  darurat: "Darurat",
  lainnya: "Lainnya",
};
