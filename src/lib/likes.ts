import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export async function hasLiked(postId: number, userId: number) {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `
    SELECT 1
    FROM post_likes
    WHERE post_id = ? AND user_id = ?
    LIMIT 1
    `,
    [postId, userId],
  );

  return rows.length > 0;
}

export async function addLike(postId: number, userId: number) {
  await pool.query(
    `
    INSERT INTO post_likes (post_id, user_id)
    VALUES (?, ?)
    `,
    [postId, userId],
  );
}

export async function removeLike(postId: number, userId: number) {
  await pool.query(
    `
    DELETE FROM post_likes
    WHERE post_id = ? AND user_id = ?
    `,
    [postId, userId],
  );
}

export async function getLikeCount(postId: number) {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `
    SELECT COUNT(*) AS count
    FROM post_likes
    WHERE post_id = ?
    `,
    [postId],
  );

  return Number(rows[0]?.count ?? 0);
}
