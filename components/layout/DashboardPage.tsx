"use client";

import { ReactNode, Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardPageProps {
  children: ReactNode;
}

export default function DashboardPage({ children }: DashboardPageProps) {
  return (
    <div className="min-h-dvh bg-neutral-bg md:grid md:grid-cols-[280px_minmax(0,1fr)]">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <main className="min-w-0">
        <div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 pb-28 sm:px-6 sm:py-6 sm:pb-6 md:px-8 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
