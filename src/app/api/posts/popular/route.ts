import { NextResponse } from "next/server";
import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `
    SELECT
      p.id,
      p.title,
      COUNT(pl.user_id) AS likeCount
    FROM posts p
    LEFT JOIN post_likes pl ON p.id = pl.post_id
      AND pl.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    WHERE p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY p.id
    ORDER BY likeCount DESC, p.created_at DESC
    LIMIT 5
    `,
  );

  return NextResponse.json(rows);
}
