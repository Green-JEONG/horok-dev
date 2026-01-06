// HeaderNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "홈", match: (p: string) => p === "/" },
  {
    href: "/feed",
    label: "피드",
    match: (p: string) => p === "/feed" || p.startsWith("/feed/"),
  },
  {
    href: "/favorites",
    label: "좋아요",
    match: (p: string) => p.startsWith("/favorites"),
  },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const isFeed = pathname === "/" || pathname.startsWith("/posts");

  return (
    <nav className="flex items-center gap-24 text-sm font-medium">
      {navItems.map((item) => {
        const isActive = item.match(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "transition-colors",
              isActive
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
