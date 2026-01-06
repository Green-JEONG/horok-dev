import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import {
  getCommentById,
  updateComment,
  softDeleteComment,
} from "@/lib/comments";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const commentId = Number(params.id);
  if (Number.isNaN(commentId)) {
    return NextResponse.json(
      { message: "Invalid comment id" },
      { status: 400 },
    );
  }

  const comment = await getCommentById(commentId);
  if (!comment) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const userId = Number(session.user.id);
  const isOwner = comment.user_id === userId;

  if (!isOwner) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { content } = body;

  if (!content) {
    return NextResponse.json({ message: "Content required" }, { status: 400 });
  }

  const updated = await updateComment({
    commentId,
    content,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const commentId = Number(params.id);
  if (Number.isNaN(commentId)) {
    return NextResponse.json(
      { message: "Invalid comment id" },
      { status: 400 },
    );
  }

  const comment = await getCommentById(commentId);
  if (!comment) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const userId = Number(session.user.id);
  const isOwner = comment.user_id === userId;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await softDeleteComment(commentId);

  return NextResponse.json({ ok: true });
}
