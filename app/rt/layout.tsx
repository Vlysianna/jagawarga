"use client";

import { ReactNode } from "react";
import DashboardPage from "@/components/layout/DashboardPage";

export default function RTLayout({ children }: { children: ReactNode }) {
  return <DashboardPage title="Ketua RT">{children}</DashboardPage>;
}
