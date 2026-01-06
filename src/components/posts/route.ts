import { NextResponse } from "next/server";
import { findPostsPaged } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);

  if (page < 1) {
    return NextResponse.json([], { status: 200 });
  }

  const limit = 12;
  const offset = (page - 1) * limit;

  const posts = await findPostsPaged(limit, offset);
  return NextResponse.json(posts);
}
