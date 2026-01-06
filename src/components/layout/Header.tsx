import Link from "next/link";
import Image from "next/image";
import HeaderActions from "./HeaderActions";
import HeaderNav from "./HeaderNav";
import HeaderSearch from "./HeaderSearch";
import ThemeToggle from "./ThemeToggle";

export default async function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between">
        <div className="flex gap-20">
          <Link href="/" className="flex items-center gap-1 font-bold">
            <Image src="/logo.svg" alt="Horok Tech" width={50} height={32} />
            <div className="flex flex-col leading-none items-center">
              <span className="sr-only">Horok Tech</span>
              <span aria-hidden className="text-sm">
                Horok
              </span>
              <span aria-hidden className="text-sm">
                Tech
              </span>
            </div>
          </Link>

          <HeaderNav />
        </div>

        <div className="flex items-center gap-3">
          <HeaderSearch />
          <ThemeToggle />
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
