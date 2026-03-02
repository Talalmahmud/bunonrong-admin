"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
  ArrowLeftRight,
  MenuIcon,
  ChevronLeft,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";

export const Button = dynamic(
  () => import("@/components/ui/button").then((m) => m.Button),
  { ssr: false }
);
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Category } from "@/types/category";
import api from "@/lib/axiosInterceptor";
import MobileSidebar from "./mobileSiseBar";
import CategorySkeleton from "./category-skeleton";
import { imageLink } from "@/config/cloudinary";
import Link from "next/link";
import Logout from "./Logout";

type Props = {
  onToggleSidebar: () => void;
};

// Categories with images

// Example search products
const products = [
  "Smartphone",
  "Laptop",
  "Headphones",
  "T-Shirt",
  "Coffee Maker",
  "Running Shoes",
  "Blender",
];

export default function TopNavbar({ onToggleSidebar }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside

  return (
    <header className="sticky top-0 z-50 h-17 border-b-2 border-red-800  bg-white ">
      <div className="flex h-full items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <MobileSidebar />

          <Button
            className=" hidden md:flex justify-center bg-red-100 items-center"
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
          >
            <ChevronLeft className="min-h-6 min-w-6" />
          </Button>
          <Link href={"/"}>
            <Image
              src={"/logo.svg"}
              height={40}
              width={80}
              className="w-[200px]  "
              alt=""
            />
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <Logout />
        </div>
      </div>
    </header>
  );
}
