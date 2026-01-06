import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export async function getCategoryBySlug(slug: string) {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `
    SELECT id, name, slug
    FROM categories
    WHERE slug = ?
    LIMIT 1
    `,
    [slug],
  );

  return rows[0] ?? null;
}

export async function getPostsByCategory(params: {
  categoryId: number;
  page: number;
  limit: number;
}) {
  const { categoryId, page, limit } = params;
  const offset = (page - 1) * limit;

  const [posts] = await pool.query<mysql.RowDataPacket[]>(
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
    WHERE p.category_id = ?
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [categoryId, limit, offset],
  );

  const [countRows] = await pool.query<mysql.RowDataPacket[]>(
    `
    SELECT COUNT(*) AS total
    FROM posts
    WHERE category_id = ?
    `,
    [categoryId],
  );

  return {
    posts,
    total: Number(countRows[0]?.total ?? 0),
  };
}
