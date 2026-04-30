"use client";

import { ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { horokCoteProblems } from "@/lib/horok-cote";

type HorokCoteProblemQuickSearchProps = {
  number: number;
  title: string;
};

export default function HorokCoteProblemQuickSearch({
  number,
  title,
}: HorokCoteProblemQuickSearchProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return horokCoteProblems.slice(0, 6);
    }

    return horokCoteProblems
      .filter((problem) => {
        const fullLabel = `${problem.number} ${problem.title}`.toLowerCase();
        return (
          String(problem.number).includes(trimmedQuery) ||
          problem.title.toLowerCase().includes(trimmedQuery) ||
          fullLabel.includes(trimmedQuery)
        );
      })
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsEditing(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isEditing]);

  const handleSelectProblem = (slug: string) => {
    const selectedProblem = horokCoteProblems.find(
      (problem) => problem.slug === slug,
    );

    if (!selectedProblem) {
      return;
    }

    setIsEditing(false);
    setQuery("");
    router.push(`/horok-cote/${selectedProblem.number}`);
  };

  if (!isEditing) {
    return (
      <>
        <button
          type="button"
          onDoubleClick={() => setIsEditing(true)}
          className="font-semibold text-slate-950 outline-none"
        >
          {number}번
        </button>
        <ChevronRight className="size-4 text-slate-300" />
        <button
          type="button"
          onDoubleClick={() => setIsEditing(true)}
          className="font-semibold text-slate-950 outline-none"
        >
          {title}
        </button>
      </>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="inline-flex min-w-[280px] items-center gap-2 rounded-[999px] border border-slate-200 bg-white px-4 py-2">
        <Search className="size-4 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsEditing(false);
              setQuery("");
            }

            if (event.key === "Enter" && suggestions[0]) {
              handleSelectProblem(suggestions[0].slug);
            }
          }}
          placeholder="문제 번호 또는 제목 입력"
          className="w-full border-0 bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
        {suggestions.length > 0 ? (
          <div className="space-y-1">
            {suggestions.map((problem) => (
              <button
                key={problem.slug}
                type="button"
                onClick={() => handleSelectProblem(problem.slug)}
                className="flex w-full items-center justify-between rounded-[18px] px-3 py-2 text-left transition hover:bg-slate-100"
              >
                <span className="text-sm font-semibold text-slate-950">
                  {problem.number}번
                </span>
                <span className="ml-3 flex-1 truncate text-sm text-slate-600">
                  {problem.title}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] px-3 py-2 text-sm font-medium text-slate-400">
            준비중입니다.
          </div>
        )}
      </div>
    </div>
  );
}
