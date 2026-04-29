export type UserRole = "citizen" | "rt" | "rw" | "pemda";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  avatar?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  citizen: "Warga",
  rt: "Ketua RT",
  rw: "Ketua RW",
  pemda: "Pemerintah Daerah",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  citizen: "Akses diskusi, event, bantuan, dan transparansi RT",
  rt: "Kelola warga, event, laporan, kas, dan data warga rentan",
  rw: "Koordinasi antar RT, review laporan, dan buat event RW",
  pemda: "Dashboard analitik, review laporan, dan alokasi anggaran",
};
