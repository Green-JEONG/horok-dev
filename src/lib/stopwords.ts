import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";

let cachedStopWords: Set<string> | null = null;
let cachedAt = 0;
const TTL = 1000 * 60 * 10; // 10분

export async function getStopWords(): Promise<Set<string>> {
  const now = Date.now();

  if (cachedStopWords && now - cachedAt < TTL) {
    return cachedStopWords;
  }

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT word FROM stop_words`,
  );

  cachedStopWords = new Set(rows.map((row) => String(row.word).toLowerCase()));
  cachedAt = now;

  return cachedStopWords;
}
