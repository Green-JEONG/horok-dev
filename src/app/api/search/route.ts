import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { normalizeQuery } from "@/lib/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("q") ?? "";

  const q = await normalizeQuery(raw);
  if (!q) return NextResponse.json([]);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = 12;
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `
    SELECT
      p.id,
      p.title,
      p.content,
      p.created_at,
      u.name AS author_name,
      c.name AS category_name,
      0 AS likes_count,
      0 AS comments_count
    FROM posts p
    JOIN users u ON u.id = p.user_id
    JOIN categories c ON c.id = p.category_id
    WHERE MATCH(p.title, p.content)
      AGAINST (? IN BOOLEAN MODE)
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [`${q}*`, limit, offset],
  );

  return NextResponse.json(rows);
}
