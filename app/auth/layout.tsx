import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-blue-light">
      {/* Header */}
      <header className="w-full bg-blue-primary px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-primary font-bold text-lg">JW</span>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">
            JagaWarga
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
