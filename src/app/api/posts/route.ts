import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { createPost } from "@/lib/posts";
import { pool } from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(
    `SELECT p.id, p.title, p.created_at, c.name AS category, u.email AS author
     FROM posts p
     JOIN categories c ON p.category_id = c.id
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`,
  );

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    console.error("Invalid session user id:", session.user);
    return NextResponse.json(
      { message: "Invalid user id in session" },
      { status: 500 },
    );
  }

  const body = await req.json();
  const { categoryId, title, content } = body;

  if (!categoryId || !title || !content) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const post = await createPost({
    userId,
    categoryId,
    title,
    content,
  });

  return NextResponse.json(post, { status: 201 });
}
