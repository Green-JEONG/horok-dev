"use client";

import { useEffect, useMemo, useState } from "react";

type Contribution = {
  date: string;
  count: number;
};

function getColor(count: number) {
  if (count === 0) return "bg-muted";
  if (count < 2) return "bg-emerald-200";
  if (count < 4) return "bg-emerald-400";
  return "bg-emerald-600";
}

const WEEKS = 36;
const DAYS = WEEKS * 7;

export default function ContributionGrid() {
  const [data, setData] = useState<Contribution[]>([]);

  useEffect(() => {
    fetch("/api/users/contributions")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const map = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of data) {
      m.set(d.date, d.count);
    }
    return m;
  }, [data]);

  const days = useMemo(() => {
    const result: string[] = [];
    const today = new Date();

    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      result.push(d.toISOString().slice(0, 10));
    }
    return result;
  }, []);

  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="mb-2 text-sm font-semibold"></p>

      <div
        className="grid gap-1"
        style={{
          gridAutoFlow: "column",
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
        }}
      >
        {days.map((date) => {
          const count = map.get(date) ?? 0;
          return (
            <div
              key={date}
              title={`${date}: ${count}회`}
              className={`h-4 w-full ${getColor(count)}`}
            />
          );
        })}
      </div>
    </div>
  );
}
