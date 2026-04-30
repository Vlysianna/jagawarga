"use client";

import { useMemo, useState } from "react";
import { HeartHandshake, Phone, Search } from "lucide-react";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import { getAuthUser } from "@/lib/utils/auth";
import { getVisibleElderlyUsers } from "@/lib/utils/user-management";
import { readUsers } from "@/lib/utils/user-store";
import { User } from "@/lib/types/user";

export default function ElderlyResidentsPage() {
  const authUser = getAuthUser();
  const [users] = useState<User[]>(() => readUsers());
  const [keyword, setKeyword] = useState("");

  const elderlyUsers = useMemo(() => {
    if (!authUser) return [];

    const visible = getVisibleElderlyUsers(users, authUser);
    const normalized = keyword.trim().toLowerCase();

    if (!normalized) return visible;

    return visible.filter((user) =>
      [user.name, user.address, user.phone, user.nik]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized))
    );
  }, [authUser, keyword, users]);

  const title =
    authUser?.role === "rt" ? "Daftar User Lansia RT" : "Daftar User Lansia";
  const description =
    authUser?.role === "rt"
      ? "Pantau warga lansia di RT aktif untuk memudahkan pendampingan"
      : "Lihat warga lansia di lingkungan RT Anda";

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        icon={HeartHandshake}
      />

      <section className="rounded-2xl border border-neutral-border bg-white p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            label="Cari Lansia"
            placeholder="Cari nama, NIK, alamat, atau telepon"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <div className="rounded-2xl border border-blue-border bg-blue-light p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-dark">
              Total Terlihat
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-dark">
              {elderlyUsers.length}
            </p>
            <p className="mt-1 text-xs text-blue-dark/80">
              Data mengikuti scope akun yang sedang login.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {elderlyUsers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-border bg-white px-4 py-10 text-center">
            <Search size={34} className="mx-auto text-neutral-border" />
            <p className="mt-3 text-sm text-neutral-text">
              Belum ada data lansia yang cocok dengan pencarian.
            </p>
          </div>
        ) : (
          elderlyUsers.map((user) => (
            <article
              key={user.id}
              className="rounded-2xl border border-neutral-border bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">
                      {user.name}
                    </h2>
                    <span className="rounded-full bg-yellow-light px-2 py-1 text-[11px] font-semibold text-yellow-dark">
                      {user.age ? `${user.age} tahun` : "Lansia"}
                    </span>
                    {user.gender ? (
                      <span className="rounded-full bg-neutral-bg px-2 py-1 text-[11px] font-semibold text-neutral-dark">
                        {user.gender}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 grid gap-2 text-sm text-neutral-text sm:grid-cols-2">
                    <p>NIK: {user.nik || "-"}</p>
                    <p className="inline-flex items-center gap-2">
                      <Phone size={14} />
                      {user.phone}
                    </p>
                    <p>
                      RT/RW: {user.detail.rt || "-"} / {user.detail.rw || "-"}
                    </p>
                    <p>
                      Wilayah: {user.detail.kelurahan || "-"}, {user.detail.kecamatan || "-"}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-neutral-dark">{user.address}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
