"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

type Keyword = {
  word: string;
  count: number;
};

// recommendedKeywords.ts
export const RECOMMENDED_KEYWORDS = [
  "Back-end",
  "Docker",
  "Java",
  "TypeScript",
  "Next",
  "TailwindCSS",
  "Front-end",
  "MySQL",
  "React",
  "Prisma",
] as const;

export default function RecommendedKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    fetch("/api/keywords/recommended")
      .then((res) => res.json())
      .then(setKeywords);
  }, []);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Image src="/thumb.svg" alt="thumb" width={18} height={18} />
        <h3 className="text-sm font-semibold">추천</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((k) => (
          <button
            type="button"
            key={k.word}
            onClick={() =>
              router.push(`/?keyword=${encodeURIComponent(k.word)}`)
            }
            className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-colors"
          >
            #{k.word}
          </button>
        ))}
      </div>
    </section>
  );
}
