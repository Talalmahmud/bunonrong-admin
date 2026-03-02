"use client";
import Breadcrumb from "@/components/shared/breadcrum";
import Footer from "@/components/shared/footer";
import TopNavbar from "@/components/shared/navbar";
import Sidebar from "@/components/shared/sidebar";
import React, { useState } from "react";

const VendorLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-slate-100 overflow-x-hidden">
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopNavbar onToggleSidebar={() => setCollapsed(!collapsed)} />
        <Breadcrumb />
        <div className="flex-1 p-6 overflow-x-hidden">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default VendorLayout;
