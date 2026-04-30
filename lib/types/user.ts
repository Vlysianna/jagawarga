export type UserRole = "citizen" | "rt" | "rw" | "kel" | "kec" | "pemda" | "pemprov";

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