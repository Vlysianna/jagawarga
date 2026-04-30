"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  Phone,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import Select from "@/components/ui/Select";
import { getAuthUser } from "@/lib/utils/auth";
import { getVisibleElderlyUsers } from "@/lib/utils/user-management";
import {
  createVisitId,
  readElderlyVisits,
  readUsers,
  removeElderlyVisit,
  upsertElderlyVisit,
} from "@/lib/utils/user-store";
import {
  ElderlyVisitSchedule,
  ELDERLY_VISIT_STATUS_LABELS,
  ElderlyVisitStatus,
  User,
} from "@/lib/types/user";

interface VisitFormState {
  scheduledAt: string;
  companionName: string;
  notes: string;
  status: ElderlyVisitStatus;
}

const EMPTY_VISIT_FORM: VisitFormState = {
  scheduledAt: "",
  companionName: "",
  notes: "",
  status: "planned",
};

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClasses(status: ElderlyVisitStatus): string {
  switch (status) {
    case "completed":
      return "bg-green-light text-green-dark";
    case "cancelled":
      return "bg-red-light text-red-dark";
    default:
      return "bg-blue-light text-blue-dark";
  }
}

export default function ElderlyResidentsPage() {
  const authUser = getAuthUser();
  const [users] = useState<User[]>(() => readUsers());
  const [visits, setVisits] = useState<ElderlyVisitSchedule[]>(() =>
    readElderlyVisits(),
  );
  const [keyword, setKeyword] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [form, setForm] = useState<VisitFormState>(EMPTY_VISIT_FORM);

  const elderlyUsers = useMemo(() => {
    if (!authUser) return [];

    const visible = getVisibleElderlyUsers(users, authUser);
    const normalized = keyword.trim().toLowerCase();

    if (!normalized) return visible;

    return visible.filter((user) =>
      [user.name, user.address, user.phone, user.nik]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [authUser, keyword, users]);

  const title =
    authUser?.role === "rt" ? "Daftar User Lansia RT" : "Daftar User Lansia";
  const description =
    authUser?.role === "rt"
      ? "Pantau warga lansia di RT aktif untuk memudahkan pendampingan"
      : "Lihat warga lansia di lingkungan RT Anda";

  if (!authUser) return null;
  const currentUser = authUser;

  function resetForm() {
    setForm(EMPTY_VISIT_FORM);
  }

  function handleSubmitVisit(
    event: FormEvent<HTMLFormElement>,
    userId: string,
  ) {
    event.preventDefault();

    const nextVisit: ElderlyVisitSchedule = {
      id: createVisitId(),
      userId,
      scheduledAt: form.scheduledAt,
      companionName: form.companionName.trim(),
      notes: form.notes.trim(),
      status: form.status,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
    };

    const nextVisits = upsertElderlyVisit(nextVisit);
    setVisits(nextVisits);
    resetForm();
  }

  function handleDeleteVisit(visitId: string) {
    const nextVisits = removeElderlyVisit(visitId);
    setVisits(nextVisits);
  }

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
            <ElderlyResidentCard
              key={user.id}
              user={user}
              visits={visits.filter((visit) => visit.userId === user.id)}
              expanded={expandedUserId === user.id}
              form={form}
              onExpand={() => {
                setExpandedUserId((current) =>
                  current === user.id ? null : user.id,
                );
                resetForm();
              }}
              onFormChange={setForm}
              onSubmitVisit={handleSubmitVisit}
              onDeleteVisit={handleDeleteVisit}
              isRT={currentUser.role === "rt"}
            />
          ))
        )}
      </section>
    </div>
  );
}

function ElderlyResidentCard({
  user,
  visits,
  expanded,
  form,
  onExpand,
  onFormChange,
  onSubmitVisit,
  onDeleteVisit,
  isRT,
}: {
  user: User;
  visits: ElderlyVisitSchedule[];
  expanded: boolean;
  form: VisitFormState;
  onExpand: () => void;
  onFormChange: (form: VisitFormState) => void;
  onSubmitVisit: (event: FormEvent<HTMLFormElement>, userId: string) => void;
  onDeleteVisit: (visitId: string) => void;
  isRT: boolean;
}) {
  const sortedVisits = [...visits].sort((a, b) =>
    a.scheduledAt.localeCompare(b.scheduledAt),
  );

  return (
    <article className="rounded-2xl border border-neutral-border bg-white p-4 sm:p-5">
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
              Wilayah: {user.detail.kelurahan || "-"},{" "}
              {user.detail.kecamatan || "-"}
            </p>
          </div>
          <p className="mt-3 text-sm text-neutral-dark">{user.address}</p>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <div className="rounded-xl bg-blue-light px-3 py-2 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-dark">
              Jadwal
            </p>
            <p className="mt-1 text-lg font-bold text-blue-dark">
              {visits.length}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onExpand}
          >
            <CalendarDays size={15} className="mr-2" />
            {expanded
              ? "Tutup Jadwal"
              : isRT
                ? "Atur Kunjungan"
                : "Lihat Jadwal"}
          </Button>
        </div>
      </div>

      {expanded ? (
        <div className="mt-5 space-y-5 border-t border-neutral-border pt-5">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Jadwal Kunjungan
              </h3>
            </div>

            <div className="space-y-3">
              {sortedVisits.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-border px-4 py-6 text-sm text-neutral-text">
                  Belum ada jadwal kunjungan untuk warga ini.
                </div>
              ) : (
                sortedVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="rounded-xl border border-neutral-border bg-neutral-bg/40 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {formatDateTime(visit.scheduledAt)}
                          </p>
                          <span
                            className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusClasses(visit.status)}`}
                          >
                            {ELDERLY_VISIT_STATUS_LABELS[visit.status]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-dark">
                          Pendamping: {visit.companionName}
                        </p>
                        <p className="mt-1 text-sm text-neutral-text">
                          {visit.notes || "Tanpa catatan tambahan."}
                        </p>
                        <p className="mt-2 text-xs text-neutral-text">
                          Dibuat oleh {visit.createdByName}
                        </p>
                      </div>
                      {isRT && (
                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          onClick={() => onDeleteVisit(visit.id)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Hapus
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {isRT && (
            <form
              onSubmit={(event) => onSubmitVisit(event, user.id)}
              className="rounded-2xl border border-neutral-border bg-white p-4"
            >
              <div className="mb-4 flex items-center gap-2">
                <Plus size={16} className="text-blue-primary" />
                <h4 className="text-sm font-semibold text-foreground">
                  Tambah Jadwal Kunjungan
                </h4>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Tanggal dan Waktu"
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(event) =>
                    onFormChange({ ...form, scheduledAt: event.target.value })
                  }
                  required
                />
                <Input
                  label="Nama Pendamping"
                  value={form.companionName}
                  onChange={(event) =>
                    onFormChange({ ...form, companionName: event.target.value })
                  }
                  placeholder="Mis. Ketua RT / Kader Posyandu"
                  required
                />
                <Select
                  label="Status"
                  value={form.status}
                  onChange={(event) =>
                    onFormChange({
                      ...form,
                      status: event.target.value as ElderlyVisitStatus,
                    })
                  }
                >
                  <option value="planned">Terjadwal</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </Select>
                <div className="rounded-xl border border-neutral-border bg-neutral-bg/60 px-4 py-3 text-sm text-neutral-text">
                  <p className="inline-flex items-center gap-2 font-medium text-neutral-dark">
                    {form.status === "completed" ? (
                      <CheckCircle2 size={16} className="text-green-action" />
                    ) : form.status === "cancelled" ? (
                      <XCircle size={16} className="text-red-danger" />
                    ) : (
                      <CalendarDays size={16} className="text-blue-primary" />
                    )}
                    Ringkasan status
                  </p>
                  <p className="mt-2">
                    {ELDERLY_VISIT_STATUS_LABELS[form.status]} untuk kunjungan
                    warga lansia ini.
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-neutral-dark">
                    Catatan
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(event) =>
                      onFormChange({ ...form, notes: event.target.value })
                    }
                    rows={3}
                    className="w-full rounded-xl border border-neutral-border bg-white px-4 py-3 text-base text-foreground placeholder:text-neutral-text/50 focus:outline-none focus:ring-2 focus:ring-blue-border"
                    placeholder="Contoh: perlu pendampingan obat, cek tekanan darah, atau antar ke puskesmas."
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button type="submit">
                  <Plus size={15} className="mr-2" />
                  Simpan Jadwal
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </article>
  );
}
