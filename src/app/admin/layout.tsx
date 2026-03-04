"use client";
import Breadcrumb from "@/components/shared/breadcrum";
import Footer from "@/components/shared/footer";
import TopNavbar from "@/components/shared/navbar";
import Sidebar from "@/components/shared/sidebar";
import React, { useState } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopNavbar onToggleSidebar={() => setCollapsed(!collapsed)} />
        <Breadcrumb />
        <main className="flex-1 p-6  overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
