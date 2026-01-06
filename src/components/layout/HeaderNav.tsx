import Link from "next/link";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/feed", label: "피드" },
  { href: "/favorites", label: "좋아요" },
];

export default function HeaderNav() {
  return (
    <nav className="flex items-center gap-24 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
