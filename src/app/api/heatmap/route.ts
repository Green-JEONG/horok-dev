import { NextResponse } from "next/server";
import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";

type HeatmapRow = {
  date: string;
  count: number;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const daysParam = url.searchParams.get("days") ?? "365";
  const days = Number(daysParam);

  if (Number.isNaN(days) || days <= 0 || days > 730) {
    return NextResponse.json(
      { message: "Invalid days parameter" },
      { status: 400 },
    );
  }

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `
    SELECT
      DATE(created_at) AS date,
      COUNT(*) AS count
    FROM posts
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
    `,
    [days],
  );

  const data: HeatmapRow[] = rows.map((row) => ({
    date: row.date,
    count: Number(row.count),
  }));

  return NextResponse.json({
    days,
    totalActiveDays: data.length,
    data,
  });
}
