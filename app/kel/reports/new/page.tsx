"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { REPORT_CATEGORY_LABELS, ReportCategory } from "@/lib/types/report";

export default function KelNewReportPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push("/kel/reports");
    }, 2000);
  }

  if (submitted) {
    return (
      <div>
        <PageHeader title="Buat Laporan Resmi" backHref="/kel/reports" />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center mb-4">
            <FileText size={32} className="text-green-action" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Laporan Terkirim ke Kecamatan
          </h2>
          <p className="text-sm text-neutral-text">
            Laporan resmi dengan estimasi anggaran sudah dikirim ke Kecamatan
            untuk ditindaklanjuti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Buat Laporan Resmi"
        description="Buat laporan resmi dengan estimasi anggaran dan kirim ke Kecamatan"
        backHref="/kel/reports"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-neutral-border p-5 space-y-5">
          <Input
            label="Judul Laporan"
            placeholder="Contoh: Perbaikan Saluran Air Kelurahan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            label="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value as ReportCategory)}
            required
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            {Object.entries(REPORT_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-neutral-dark"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Jelaskan masalah secara detail: lokasi, kondisi, dampak, dsb."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="
                w-full px-4 py-3 text-base rounded-xl border
                bg-white text-foreground
                placeholder:text-neutral-text/50
                border-neutral-border
                focus:outline-none focus:ring-2 focus:ring-blue-border focus:border-blue-primary
                resize-none
              "
            />
          </div>

          <Input
            label="Estimasi Anggaran (Rp)"
            type="number"
            placeholder="Contoh: 10000000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="note"
              className="text-sm font-medium text-neutral-dark"
            >
              Catatan untuk Kecamatan
            </label>
            <textarea
              id="note"
              rows={3}
              placeholder="Tuliskan catatan atau alasan pengajuan ke Kecamatan..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
              className="
                w-full px-4 py-3 text-base rounded-xl border
                bg-white text-foreground
                placeholder:text-neutral-text/50
                border-neutral-border
                focus:outline-none focus:ring-2 focus:ring-blue-border focus:border-blue-primary
                resize-none
              "
            />
          </div>

          {/* Upload Photo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-dark">
              Foto (opsional)
            </label>
            <div className="border-2 border-dashed border-neutral-border rounded-xl p-8 text-center">
              <p className="text-sm text-neutral-text">
                Klik atau seret foto ke sini
              </p>
              <p className="text-xs text-neutral-text/70 mt-1">
                Maks. 3 foto, format JPG/PNG
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-light rounded-xl p-4 border border-blue-border">
          <p className="text-sm text-blue-dark">
            <strong>Catatan:</strong> Laporan resmi ini akan langsung dikirim ke
            Kecamatan beserta estimasi anggaran. Kecamatan dapat meneruskan ke
            Pemda atau menolak.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!title || !category || !description || !budget || !note}
          >
            Kirim ke Kecamatan
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/kel/reports")}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
