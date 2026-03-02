"use client";
import { getCookie } from "cookies-next/client";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { removeUserCookie } from "@/app/actions/login";

const Logout = () => {
  const router = useRouter();
  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  const handlelogout = () => {
    removeUserCookie();
    router.push("/");
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <User className=" min-h-5 min-w-5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 mt-2.5">
          <DropdownMenuItem>
            {accessToken && refreshToken ? (
              <div onClick={handlelogout} className=" flex items-center gap-2">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </div>
            ) : (
              <Link href={"/login"} className=" flex items-center gap-2">
                <LogOut className="mr-2 h-4 w-4" />
                Login
              </Link>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Logout;
