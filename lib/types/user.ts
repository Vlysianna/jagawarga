export type UserRole =
  | "citizen"
  | "rt"
  | "rw"
  | "kel"
  | "kec"
  | "pemda"
  | "pemprov";
export type gender = "laki-laki" | "perempuan";
export type ElderlyVisitStatus = "planned" | "completed" | "cancelled";

export interface UserDetail {
  rt: string | null;
  rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  daerah: string | null;
  provinsi: string | null;
}

export interface User {
  id: string;
  nik?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  address: string;
  avatar?: string;
  age?: number;
  is_lansia?: boolean;
  gender?: gender;
  scope_id: string;
  detail: UserDetail;
}

export interface AuthUser {
  id: string;
  nik?: string;
  name: string;
  email: string;
  role: UserRole;
  scope_id: string;
  detail: UserDetail;
}

export interface ElderlyVisitSchedule {
  id: string;
  userId: string;
  scheduledAt: string;
  companionName: string;
  notes: string;
  status: ElderlyVisitStatus;
  createdBy: string;
  createdByName: string;
}

export function getVoterId(user: AuthUser | User): string {
  return user.nik || user.id;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  citizen: "Warga",
  rt: "Ketua RT",
  rw: "Ketua RW",
  kel: "Kelurahan",
  kec: "Kecamatan",
  pemda: "Pemerintah Daerah",
  pemprov: "Pemerintah Provinsi",
};

export const ELDERLY_VISIT_STATUS_LABELS: Record<ElderlyVisitStatus, string> = {
  planned: "Terjadwal",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};
