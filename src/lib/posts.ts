import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export type PostRow = {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export async function getPostById(id: number) {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT * FROM posts WHERE id = ?",
    [id],
  );
  return (rows[0] as PostRow | undefined) ?? null;
}

export async function createPost(params: {
  userId: number;
  categoryId: number;
  title: string;
  content: string;
}) {
  const { userId, categoryId, title, content } = params;

  const [result] = await pool.query<mysql.ResultSetHeader>(
    `INSERT INTO posts (user_id, category_id, title, content) VALUES (?, ?, ?, ?)`,
    [userId, categoryId, title, content],
  );

  return getPostById(result.insertId);
}

export async function updatePost(params: {
  postId: number;
  title: string;
  content: string;
}) {
  const { postId, title, content } = params;

  await pool.query(
    `UPDATE posts
     SET title = ?, content = ?
     WHERE id = ?`,
    [title, content, postId],
  );

  return getPostById(postId);
}

export async function deletePost(postId: number) {
  await pool.query("DELETE FROM posts WHERE id = ?", [postId]);
}
