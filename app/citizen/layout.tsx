"use client";

import { ReactNode } from "react";
import DashboardPage from "@/components/layout/DashboardPage";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return <DashboardPage title="Warga">{children}</DashboardPage>;
}
