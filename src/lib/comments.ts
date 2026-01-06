import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export type CommentRow = {
  id: number;
  post_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export async function getCommentsByPost(postId: number) {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `
    SELECT
      c.id,
      c.post_id,
      c.user_id,
      c.parent_id,
      c.content,
      c.is_deleted,
      c.created_at,
      u.email AS author
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
    `,
    [postId],
  );

  return rows;
}

export async function getCommentById(id: number) {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT * FROM comments WHERE id = ?",
    [id],
  );
  return (rows[0] as CommentRow | undefined) ?? null;
}

export async function createComment(params: {
  postId: number;
  userId: number;
  content: string;
  parentId?: number | null;
}) {
  const { postId, userId, content, parentId = null } = params;

  const [result] = await pool.query<mysql.ResultSetHeader>(
    `
    INSERT INTO comments (post_id, user_id, parent_id, content)
    VALUES (?, ?, ?, ?)
    `,
    [postId, userId, parentId, content],
  );

  return getCommentById(result.insertId);
}

export async function updateComment(params: {
  commentId: number;
  content: string;
}) {
  const { commentId, content } = params;

  await pool.query(
    `
    UPDATE comments
    SET content = ?
    WHERE id = ?
    `,
    [content, commentId],
  );

  return getCommentById(commentId);
}

export async function softDeleteComment(commentId: number) {
  await pool.query(
    `
    UPDATE comments
    SET is_deleted = TRUE
    WHERE id = ?
    `,
    [commentId],
  );
}
