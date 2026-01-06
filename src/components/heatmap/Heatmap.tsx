"use client";

import { useEffect, useMemo, useState } from "react";
import HeatmapCell from "./HeatmapCell";
import { getHeatmapLevel } from "./heatmap.util";

type HeatmapItem = {
  date: string; // YYYY-MM-DD
  count: number;
};

export default function Heatmap() {
  const [data, setData] = useState<HeatmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/heatmap?days=365")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data ?? []);
        setLoading(false);
      });
  }, []);

  const map = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of data) {
      m.set(d.date, d.count);
    }
    return m;
  }, [data]);

  const days = useMemo(() => {
    const result: { date: string; count: number }[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      result.push({
        date,
        count: map.get(date) ?? 0,
      });
    }
    return result;
  }, [map]);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">Loading heatmap...</div>
    );
  }

  return (
    <div className="flex gap-1">
      {chunk(days, 7).map((week) => {
        const weekKey = week[0]?.date; // 해당 주의 시작일

        return (
          <div key={weekKey} className="flex flex-col gap-1">
            {week.map((day) => (
              <HeatmapCell
                key={day.date} // 이미 정답
                date={day.date}
                count={day.count}
                level={getHeatmapLevel(day.count)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}
