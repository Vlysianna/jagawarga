import { KAS_SUMMARY, KAS_USAGES } from "@/lib/data/kas";
import { KAS_CATEGORY_LABELS } from "@/lib/types/kas";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function KasPage() {
  const totalUsage = KAS_USAGES.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white border border-neutral-border rounded-2xl p-4 sm:p-5">
          <p className="text-sm text-neutral-text">Saldo Kas</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatCurrency(KAS_SUMMARY.balance)}
          </p>
          <p className="text-xs text-neutral-text mt-2">
            Update terakhir {formatDate(KAS_SUMMARY.updatedAt)}
          </p>
        </div>
        <div className="bg-white border border-neutral-border rounded-2xl p-4 sm:p-5">
          <p className="text-sm text-neutral-text">Kas Masuk Bulan Ini</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatCurrency(KAS_SUMMARY.monthIncome)}
          </p>
          <p className="text-xs text-neutral-text mt-2">
            Target {formatCurrency(KAS_SUMMARY.targetMonthly)}
          </p>
        </div>
        <div className="bg-white border border-neutral-border rounded-2xl p-4 sm:p-5">
          <p className="text-sm text-neutral-text">Kas Keluar Bulan Ini</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {formatCurrency(KAS_SUMMARY.monthExpense)}
          </p>
          <p className="text-xs text-neutral-text mt-2">
            Total terpakai {formatCurrency(totalUsage)}
          </p>
        </div>
      </section>

      <section className="bg-white border border-neutral-border rounded-2xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              History Kas Terpakai
            </h2>
            <p className="text-sm text-neutral-text mt-1">
              Rincian penggunaan kas untuk kegiatan warga
            </p>
          </div>
          <div className="text-xs text-neutral-text bg-neutral-bg px-2 py-1 rounded-full">
            {KAS_USAGES.length} transaksi
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-text border-b border-neutral-border">
                <th className="py-2 pr-3 font-medium">Tanggal</th>
                <th className="py-2 pr-3 font-medium">Kegiatan</th>
                <th className="py-2 pr-3 font-medium">Kategori</th>
                <th className="py-2 pr-3 font-medium">Nominal</th>
                <th className="py-2 pr-3 font-medium">Penyedia</th>
                <th className="py-2 pr-3 font-medium">Disetujui</th>
                <th className="py-2 font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {KAS_USAGES.map((usage) => (
                <tr
                  key={usage.id}
                  className="border-b border-neutral-border last:border-b-0"
                >
                  <td className="py-3 pr-3 text-neutral-text">
                    {formatDate(usage.date)}
                  </td>
                  <td className="py-3 pr-3 text-foreground font-medium">
                    {usage.title}
                  </td>
                  <td className="py-3 pr-3 text-neutral-text">
                    {KAS_CATEGORY_LABELS[usage.category]}
                  </td>
                  <td className="py-3 pr-3 text-foreground">
                    {formatCurrency(usage.amount)}
                  </td>
                  <td className="py-3 pr-3 text-neutral-text">
                    {usage.vendor}
                  </td>
                  <td className="py-3 pr-3 text-neutral-text">
                    {usage.approvedBy}
                  </td>
                  <td className="py-3 text-neutral-text">
                    {usage.note || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
