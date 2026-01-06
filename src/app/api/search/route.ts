import { NextResponse } from "next/server";
import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";
import { buildSearchQuery } from "@/lib/search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json(
      { message: "Search query too short" },
      { status: 400 },
    );
  }

  const keywords = await buildSearchQuery(q);

  if (keywords.length === 0) {
    return NextResponse.json({
      posts: [],
      message: "No valid keywords after stopword filtering",
    });
  }

  // BOOLEAN MODE용 쿼리 생성
  const booleanQuery = keywords.map((word) => `+${word}`).join(" ");

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `
    SELECT
      p.id,
      p.title,
      p.created_at,
      u.email AS author,
      COUNT(pl.user_id) AS likeCount
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN post_likes pl ON p.id = pl.post_id
    WHERE MATCH(p.title, p.content)
      AGAINST (? IN BOOLEAN MODE)
    GROUP BY p.id
    ORDER BY p.created_at DESC
    `,
    [booleanQuery],
  );

  return NextResponse.json({
    query: q,
    keywords,
    count: rows.length,
    posts: rows,
  });
}
