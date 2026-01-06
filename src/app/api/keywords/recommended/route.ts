import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export async function GET() {
  // 1. StopWord 조회
  const [stopRows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT word FROM stop_words`,
  );
  const stopWords = new Set(stopRows.map((r) => r.word));

  // 2. 최근 30일 게시글 텍스트 조회
  const [postRows] = await pool.query<mysql.RowDataPacket[]>(
    `
    SELECT title, content
    FROM posts
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `,
  );

  // 3. 단어 빈도 계산
  const counter = new Map<string, number>();

  for (const post of postRows) {
    const text = `${post.title} ${post.content}`;
    const words = text.split(/\s+/);

    for (const raw of words) {
      const word = raw.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
      if (!word || word.length < 2) continue;
      if (stopWords.has(word)) continue;

      counter.set(word, (counter.get(word) ?? 0) + 1);
    }
  }

  // 4. 상위 10개 추출
  const keywords = Array.from(counter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return NextResponse.json(keywords);
}
