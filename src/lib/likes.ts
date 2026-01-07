import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";

/**
 * 사용자가 이미 좋아요를 눌렀는지 확인
 */
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

/**
 * 좋아요 추가
 */
export async function addLike(postId: number, userId: number) {
  await pool.query(
    `
    INSERT INTO post_likes (post_id, user_id)
    VALUES (?, ?)
    `,
    [postId, userId],
  );
}

/**
 * 좋아요 제거
 */
export async function removeLike(postId: number, userId: number) {
  await pool.query(
    `
    DELETE FROM post_likes
    WHERE post_id = ? AND user_id = ?
    `,
    [postId, userId],
  );
}

/**
 * 게시글 좋아요 수 조회
 */
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

/**
 * 🔥 좋아요 토글 (추가 / 취소)
 * API route에서 사용하는 핵심 함수
 */
export async function toggleLike(params: { postId: number; userId: number }) {
  const { postId, userId } = params;

  const liked = await hasLiked(postId, userId);

  if (liked) {
    await removeLike(postId, userId);
  } else {
    await addLike(postId, userId);
  }

  const likeCount = await getLikeCount(postId);

  return {
    liked: !liked,
    likeCount,
  };
}
