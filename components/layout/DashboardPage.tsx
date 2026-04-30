"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardPageProps {
  children: ReactNode;
}

export default function DashboardPage({ children }: DashboardPageProps) {
  return (
    <div className="flex min-h-screen bg-neutral-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
