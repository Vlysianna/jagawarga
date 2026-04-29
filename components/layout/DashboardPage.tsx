"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardPageProps {
  children: ReactNode;
  title: string;
}

export default function DashboardPage({ children, title }: DashboardPageProps) {
  return (
    <div className="flex min-h-screen bg-neutral-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-neutral-border px-6 py-4">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
