"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { REPORT_CATEGORY_LABELS, ReportCategory } from "@/lib/types/report";

export default function CitizenNewReportPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push("/citizen/reports");
    }, 2000);
  }

  if (submitted) {
    return (
      <div>
        <PageHeader title="Buat Laporan" backHref="/citizen/reports" />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center mb-4">
            <FileText size={32} className="text-green-action" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">
            Laporan Terkirim
          </h2>
          <p className="text-sm text-neutral-text">
            Laporan Anda sudah dikirim ke Ketua RT. Anda bisa memantau statusnya
            di halaman Laporan Saya.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Buat Laporan Baru"
        description="Laporkan masalah di lingkungan Anda ke Ketua RT"
        backHref="/citizen/reports"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-5 rounded-xl border border-neutral-border bg-white p-4 sm:p-5">
          <Input
            label="Judul Laporan"
            placeholder="Contoh: Jalan berlubang di depan rumah No. 15"
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

          {/* Upload photo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-dark">
              Foto (opsional)
            </label>
            <div className="rounded-xl border-2 border-dashed border-neutral-border p-6 text-center sm:p-8">
              <p className="text-sm text-neutral-text">
                Klik atau seret foto ke sini
              </p>
              <p className="text-xs text-neutral-text/70 mt-1">
                Maks. 3 foto, format JPG/PNG
              </p>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-light rounded-xl p-4 border border-blue-border">
          <p className="text-sm text-blue-dark">
            <strong>Catatan:</strong> Laporan Anda akan dikirim langsung ke Ketua
            RT. Jika perlu ditindaklanjuti, RT akan membuatkan laporan resmi
            dengan estimasi anggaran dan meneruskannya ke tingkat yang lebih
            tinggi (RW, Kelurahan, Kecamatan, atau Pemda).
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="submit"
            disabled={!title || !category || !description}
            className="w-full sm:w-auto"
          >
            Kirim Laporan
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/citizen/reports")}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
