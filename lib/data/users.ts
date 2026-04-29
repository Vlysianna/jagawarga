import { User } from "@/lib/types/user";

export const USERS: User[] = [
  // warga
  {
    id: "w-001",
    name: "serge solo",
    email: "serge@local.com",
    password: "password",
    role: "citizen",
    phone: "081234567890",
    address: "Jl. Dupat No. 24",
    rt: "05",
    rw: "02",
    kelurahan: "Cipayung",
    kecamatan: "Cipayung",
  },
  {
    id: "w-002",
    name: "serge dewa",
    email: "sede@local.com",
    password: "password",
    role: "citizen",
    phone: "081234567891",
    address: "Jl. Cibubur No. 25",
    rt: "05",
    rw: "02",
    kelurahan: "Cipayung",
    kecamatan: "Cipayung",
  },
  {
    id: "w-003",
    name: "tes warga",
    email: "teswarga@local.com",
    password: "password",
    role: "citizen",
    phone: "081234567892",
    address: "Jl. Surabaya No. 66",
    rt: "05",
    rw: "02",
    kelurahan: "Depok",
    kecamatan: "Depok",
  },

  // ketua rt
  {
    id: "rt-001",
    name: "tesrt",
    email: "rt@local.com",
    password: "password",
    role: "rt",
    phone: "081234567800",
    address: "Jl. Mandar No. 1",
    rt: "05",
    rw: "02",
    kelurahan: "Mandar",
    kecamatan: "Mandar",
  },

  // ketua rw
  {
    id: "rw-001",
    name: "tes rw",
    email: "tesrw@local.com",
    password: "password",
    role: "rw",
    phone: "081234567700",
    address: "Jl. Mandar No. 22",
    rt: "01",
    rw: "02",
    kelurahan: "Mandar",
    kecamatan: "Mandar",
  },

  // PEMDA
  {
    id: "pd-001",
    name: "pemda admin",
    email: "pemda@local.com",
    password: "password",
    role: "pemda",
    phone: "081234567600",
    address: "Kantor Kecamatan Mandar",
    rt: "-",
    rw: "-",
    kelurahan: "Mandar",
    kecamatan: "Mandar",
  },
];
