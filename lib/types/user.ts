export type UserRole =
  | "citizen"
  | "rt"
  | "rw"
  | "kel"
  | "kec"
  | "pemda"
  | "pemprov";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  address: string;
  avatar?: string;
  scope_id: string;
  detail: UserDetail;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  scope_id: string;
  detail: UserDetail;
}

export interface UserDetail {
  rt: string | null;
  rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  daerah: string | null;
  provinsi: string | null;
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

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  citizen: "Akses diskusi, event, bantuan, dan transparansi RT",
  rt: "Kelola warga, event, laporan, kas, dan data warga rentan",
  rw: "Koordinasi antar RT, review laporan, dan buat event RW",
  kel: "",
  kec: "",
  pemda: "Dashboard analitik, review laporan, dan alokasi anggaran",
  pemprov: "",
};
