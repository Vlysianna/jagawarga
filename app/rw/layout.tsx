"use client";

import { ReactNode } from "react";
import DashboardPage from "@/components/layout/DashboardPage";

export default function RWLayout({ children }: { children: ReactNode }) {
  return <DashboardPage title="Ketua RW">{children}</DashboardPage>;
}
