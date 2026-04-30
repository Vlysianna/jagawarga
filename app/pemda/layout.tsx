"use client";

import { ReactNode } from "react";
import DashboardPage from "@/components/layout/DashboardPage";

export default function PemdaLayout({ children }: { children: ReactNode }) {
  return <DashboardPage>{children}</DashboardPage>;
}
