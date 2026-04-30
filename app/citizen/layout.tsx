"use client";

import { ReactNode } from "react";
import DashboardPage from "@/components/layout/DashboardPage";
import FloatingHelp from "@/components/ui/FloatingHelp";
import HelpNotifications from "@/components/ui/HelpNotifications";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardPage>
      {children}
      <HelpNotifications />
      <FloatingHelp />
    </DashboardPage>
  );
}
