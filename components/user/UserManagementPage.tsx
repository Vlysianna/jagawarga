"use client";

import { FormEvent, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, Users, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import Select from "@/components/ui/Select";
import { getAuthUser } from "@/lib/utils/auth";
import { appendScopeId } from "@/lib/utils/scope";
import {
  canManageUsers,
  getManagedRole,
  getManagedRoleLabel,
  getVisibleManagedUsers,
} from "@/lib/utils/user-management";
import {
  createUserId,
  readUsers,
  removeUser,
  upsertUser,
} from "@/lib/utils/user-store";
import { AuthUser, ROLE_LABELS, User, UserRole } from "@/lib/types/user";

type ManagedScopeField = "rt" | "rw" | "kelurahan" | "kecamatan" | null;

interface UserFormState {
  id?: string;
  nik: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  age: string;
  gender: "" | "laki-laki" | "perempuan";
  is_lansia: boolean;
  scopeLabel: string;
}

const EMPTY_FORM: UserFormState = {
  nik: "",
  name: "",
  email: "",
  password: "password",
  phone: "",
  address: "",
  age: "",
  gender: "",
  is_lansia: false,
  scopeLabel: "",
};

function getScopeField(role: UserRole): ManagedScopeField {
  switch (role) {
    case "rw":
      return "rt";
    case "kel":
      return "rw";
    case "kec":
      return "kelurahan";
    case "pemda":
      return "kecamatan";
    default:
      return null;
  }
}

function getScopeFieldLabel(role: UserRole): string {
  switch (role) {
    case "rw":
      return "Nomor RT";
    case "kel":
      return "Nomor RW";
    case "kec":
      return "Nama Kelurahan";
    case "pemda":
      return "Nama Kecamatan";
    default:
      return "Wilayah";
  }
}

function toFormState(user: User, managerRole: UserRole): UserFormState {
  const scopeField = getScopeField(managerRole);

  return {
    id: user.id,
    nik: user.nik ?? "",
    name: user.name,
    email: user.email,
    password: user.password,
    phone: user.phone,
    address: user.address,
    age: user.age ? String(user.age) : "",
    gender: user.gender ?? "",
    is_lansia: Boolean(user.is_lansia),
    scopeLabel: scopeField ? String(user.detail[scopeField] ?? "") : "",
  };
}

function buildManagedUser(
  form: UserFormState,
  authUser: AuthUser,
  managedRole: UserRole
): User {
  const scopeField = getScopeField(authUser.role);
  const scopeLabel = form.scopeLabel.trim();
  const userId = form.id ?? createUserId(managedRole);
  const childScopeId =
    managedRole === "citizen" ? authUser.scope_id : appendScopeId(authUser.scope_id, userId);

  const baseDetail = {
    rt: authUser.detail.rt,
    rw: authUser.detail.rw,
    kelurahan: authUser.detail.kelurahan,
    kecamatan: authUser.detail.kecamatan,
    daerah: authUser.detail.daerah,
    provinsi: authUser.detail.provinsi,
  };

  if (scopeField === "rt") {
    baseDetail.rt = scopeLabel || baseDetail.rt;
  }

  if (scopeField === "rw") {
    baseDetail.rt = null;
    baseDetail.rw = scopeLabel || baseDetail.rw;
  }

  if (scopeField === "kelurahan") {
    baseDetail.rt = null;
    baseDetail.rw = null;
    baseDetail.kelurahan = scopeLabel || baseDetail.kelurahan;
    baseDetail.daerah = scopeLabel || baseDetail.daerah;
  }

  if (scopeField === "kecamatan") {
    baseDetail.rt = null;
    baseDetail.rw = null;
    baseDetail.kelurahan = null;
    baseDetail.kecamatan = scopeLabel || baseDetail.kecamatan;
    baseDetail.daerah = scopeLabel || baseDetail.daerah;
  }

  return {
    id: userId,
    nik: form.nik.trim() || undefined,
    name: form.name.trim(),
    email: form.email.trim(),
    password: form.password.trim() || "password",
    role: managedRole,
    phone: form.phone.trim(),
    address: form.address.trim(),
    age: managedRole === "citizen" && form.age ? Number(form.age) : undefined,
    is_lansia: managedRole === "citizen" ? form.is_lansia : undefined,
    gender: managedRole === "citizen" ? form.gender || undefined : undefined,
    scope_id: childScopeId,
    detail: baseDetail,
  };
}

export default function UserManagementPage() {
  const authUser = getAuthUser();
  const [users, setUsers] = useState<User[]>(() => readUsers());
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const managedRole = authUser ? getManagedRole(authUser.role) : null;
  const canManage = authUser ? canManageUsers(authUser.role) : false;
  const scopeField = authUser ? getScopeField(authUser.role) : null;

  const visibleUsers = useMemo(() => {
    if (!authUser || !managedRole) return [];

    return getVisibleManagedUsers(users, authUser)
      .filter((user) =>
        managedRole === "citizen"
          ? user.scope_id === authUser.scope_id
          : true
      )
      .sort((a, b) => a.name.localeCompare(b.name, "id-ID"));
  }, [authUser, managedRole, users]);

  if (!authUser || !managedRole || !canManage) {
    return (
      <div className="space-y-4">
        <PageHeader title="Data User" description="Akses halaman ini tidak tersedia." />
        <div className="rounded-2xl border border-neutral-border bg-white p-6 text-sm text-neutral-text">
          Role ini tidak memiliki akses untuk mengelola user bawahan.
        </div>
      </div>
    );
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUser = buildManagedUser(form, authUser, managedRole);
    const nextUsers = upsertUser(nextUser);
    setUsers(nextUsers);
    resetForm();
  }

  function handleDelete(userId: string) {
    const nextUsers = removeUser(userId);
    setUsers(nextUsers);
    if (editingId === userId) {
      resetForm();
    }
  }

  function handleEdit(user: User) {
    setForm(toFormState(user, authUser.role));
    setEditingId(user.id);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data User"
        description={`Kelola akun ${getManagedRoleLabel(authUser.role).toLowerCase()} di wilayah Anda`}
        icon={Users}
        actions={
          <Button type="button" size="sm" onClick={resetForm}>
            <Plus size={16} className="mr-2" />
            User Baru
          </Button>
        }
      />

      <section className="rounded-2xl border border-neutral-border bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {editingId ? "Edit User" : `Tambah ${ROLE_LABELS[managedRole]}`}
            </h2>
            <p className="mt-1 text-sm text-neutral-text">
              Hanya user level bawah yang bisa ditambah, diubah, atau dihapus.
            </p>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-neutral-text hover:bg-neutral-bg"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Nama"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            required
          />
          <Input
            label="Password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            required
          />
          <Input
            label="Telepon"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
            required
          />
          <Input
            label="NIK"
            value={form.nik}
            onChange={(event) =>
              setForm((current) => ({ ...current, nik: event.target.value }))
            }
          />
          {scopeField ? (
            <Input
              label={getScopeFieldLabel(authUser.role)}
              value={form.scopeLabel}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  scopeLabel: event.target.value,
                }))
              }
              required
            />
          ) : null}
          {managedRole === "citizen" ? (
            <>
              <Input
                label="Usia"
                type="number"
                min="0"
                value={form.age}
                onChange={(event) =>
                  setForm((current) => ({ ...current, age: event.target.value }))
                }
              />
              <Select
                label="Gender"
                value={form.gender}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    gender: event.target.value as UserFormState["gender"],
                  }))
                }
              >
                <option value="">Pilih gender</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </Select>
            </>
          ) : null}
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 rounded-xl border border-neutral-border bg-neutral-bg/50 px-4 py-3 text-sm text-neutral-dark">
              <input
                type="checkbox"
                checked={form.is_lansia}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    is_lansia: event.target.checked,
                  }))
                }
                disabled={managedRole !== "citizen"}
              />
              Tandai sebagai warga lansia
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-neutral-dark">
              Alamat
            </label>
            <textarea
              value={form.address}
              onChange={(event) =>
                setForm((current) => ({ ...current, address: event.target.value }))
              }
              rows={3}
              className="w-full rounded-xl border border-neutral-border bg-white px-4 py-3 text-base text-foreground placeholder:text-neutral-text/50 focus:outline-none focus:ring-2 focus:ring-blue-border"
              required
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
            <Button type="submit">
              {editingId ? "Simpan Perubahan" : `Tambah ${ROLE_LABELS[managedRole]}`}
            </Button>
            {editingId ? (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Batal
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-neutral-border bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Daftar {ROLE_LABELS[managedRole]}
            </h2>
            <p className="mt-1 text-sm text-neutral-text">
              {visibleUsers.length} user ditemukan dalam wilayah aktif.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {visibleUsers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-border px-4 py-8 text-center text-sm text-neutral-text">
              Belum ada user pada level ini.
            </div>
          ) : (
            visibleUsers.map((user) => (
              <article
                key={user.id}
                className="rounded-xl border border-neutral-border p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {user.name}
                      </h3>
                      <span className="rounded-full bg-blue-light px-2 py-1 text-[11px] font-semibold text-blue-dark">
                        {ROLE_LABELS[user.role]}
                      </span>
                      {user.is_lansia ? (
                        <span className="rounded-full bg-yellow-light px-2 py-1 text-[11px] font-semibold text-yellow-dark">
                          Lansia
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 grid gap-2 text-sm text-neutral-text sm:grid-cols-2">
                      <p>Email: {user.email}</p>
                      <p>Telepon: {user.phone}</p>
                      <p>NIK: {user.nik || "-"}</p>
                      <p>
                        Wilayah: {user.detail.kecamatan || "-"}
                        {user.detail.kelurahan ? ` · ${user.detail.kelurahan}` : ""}
                        {user.detail.rw ? ` · RW ${user.detail.rw}` : ""}
                        {user.detail.rt ? ` · RT ${user.detail.rt}` : ""}
                      </p>
                      {typeof user.age === "number" ? <p>Usia: {user.age} tahun</p> : null}
                      {user.gender ? <p>Gender: {user.gender}</p> : null}
                    </div>
                    <p className="mt-2 text-sm text-neutral-dark">{user.address}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil size={15} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 size={15} className="mr-2" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
