import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { createComment } from "@/lib/comments";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { postId, content, parentId } = body;

  if (!postId || !content) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const commentId = await createComment({
    postId: Number(postId),
    userId: Number(session.user.id),
    content,
    parentId: parentId ? Number(parentId) : null,
  });

  return NextResponse.json({ id: commentId }, { status: 201 });
}
