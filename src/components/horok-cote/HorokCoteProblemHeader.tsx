"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HorokCoteLevelDropdown from "@/components/horok-cote/HorokCoteLevelDropdown";
import HorokCoteProblemQuickSearch from "@/components/horok-cote/HorokCoteProblemQuickSearch";
import { HOROK_COTE_LEVELS } from "@/lib/horok-cote";

type HorokCoteProblemHeaderProps = {
  level: string;
  number: number;
  title: string;
};

export default function HorokCoteProblemHeader({
  level,
  number,
  title,
}: HorokCoteProblemHeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b border-slate-200 pb-5">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link
          href="/horok-cote"
          className="flex items-center gap-1.5 font-bold text-slate-950 transition hover:opacity-80"
        >
          <Image src="/logo.svg" alt="horok-cote" width={36} height={24} />
          <span className="flex flex-col items-center text-sm leading-none">
            <span>horok</span>
            <span>cote</span>
          </span>
        </Link>
        <ChevronRight className="size-4 text-slate-300" />
        <HorokCoteLevelDropdown
          levels={HOROK_COTE_LEVELS}
          value={level}
          onChange={(nextLevel) =>
            router.push(`/horok-cote?level=${encodeURIComponent(nextLevel)}`)
          }
        />
        <ChevronRight className="size-4 text-slate-300" />
        <HorokCoteProblemQuickSearch number={number} title={title} />
      </div>
    </div>
  );
}
