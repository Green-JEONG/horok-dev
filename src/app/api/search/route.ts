import { NextResponse } from "next/server";
import { searchPosts } from "@/lib/db";
import { normalizeQuery } from "@/lib/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("q") ?? "";

  const q = await normalizeQuery(raw);
  if (!q) return NextResponse.json([]);

  const page = Number(searchParams.get("page") ?? 1);
  const limit = 12;
  const offset = (page - 1) * limit;

  const rows = await searchPosts(q, limit, offset);

  return NextResponse.json(rows);
}
