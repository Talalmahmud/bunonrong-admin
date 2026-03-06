"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarItem,
  sidebarMenu,
  vendorSidebarMenu,
} from "@/config/sidebarMenu";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  collapsed: boolean;
};
export default function Sidebar({ collapsed }: Props) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const filterMenu: SidebarItem[] = pathname.startsWith("/vendor")
    ? vendorSidebarMenu
    : sidebarMenu;
  return (
    <aside
      className={`h-screen hidden md:block bg-red-800 text-slate-200 sticky top-0 left-0 transition-all duration-300
        ${collapsed ? "w-15" : "min-w-50 max-w-50"}
      `}
    >
      {/* Header */}
      {!collapsed && (
        <div className="flex items-center justify-center text-3xl font-medium py-4 shadow-lg">
          أمار كورنر
        </div>
      )}
      {/* Menu */}
      <nav className="px-2 py-4 space-y-1">
        {filterMenu?.map((item, index) => {
          const Icon = item.icon;
          const isOpen = openMenu === item.label;

          return (
            <div key={index}>
              {/* Parent */}
              {item.href ? (
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition
                    ${
                      pathname === item.href
                        ? "bg-red-700 text-white border"
                        : "hover:bg-slate-400"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />

                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}

                  {/* Tooltip */}
                  {collapsed && (
                    <span className="absolute left-20 z-50 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                      {item.label}
                    </span>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  className="group relative flex items-center w-full gap-3 px-3 py-2 rounded-lg hover:bg-slate-400 transition"
                >
                  <Icon className="w-5 h-5 shrink-0" />

                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium text-left">
                        {item.label}
                      </span>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}

                  {/* Tooltip */}
                  {collapsed && (
                    <span className="absolute left-20 z-50 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                      {item.label}
                    </span>
                  )}
                </button>
              )}

              {/* Submenu */}
              {item.children && isOpen && !collapsed && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-3 py-2 text-sm rounded-lg transition
                        ${
                          pathname === child.href
                            ? "bg-slate-800 text-white"
                            : "hover:bg-slate-800"
                        }
                      `}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
