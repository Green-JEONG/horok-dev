import type mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export async function getStopWords(): Promise<Set<string>> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT word FROM stop_words`,
  );

  return new Set(rows.map((row) => row.word));
}
