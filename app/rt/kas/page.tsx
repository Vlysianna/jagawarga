import { Wallet } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KasPage from "@/components/kas/KasPage";

export default function RTKasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Kas RT"
        description="Kelola dan pantau keuangan kas berjalan di wilayah RT Anda."
        icon={Wallet}
      />
      <KasPage />
    </div>
  );
}
