"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-sm px-4  py-2 text-muted-foreground"
    >
      <ol className="flex items-center gap-1 overflow-x-auto whitespace-nowrap">
        {/* Home */}
        <li className="flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted transition"
          >
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />

              {isLast ? (
                <span className="px-2 py-1 font-medium text-foreground">
                  {formatLabel(segment)}
                </span>
              ) : (
                <Link
                  href={href}
                  className="rounded-md px-2 py-1 hover:bg-muted transition"
                >
                  {formatLabel(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function formatLabel(label: string) {
  return label.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
