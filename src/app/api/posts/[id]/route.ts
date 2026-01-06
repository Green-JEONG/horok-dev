import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getPostById, updatePost, deletePost } from "@/lib/posts";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const post = await getPostById(Number(params.id));
  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const post = await getPostById(Number(params.id));
  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const isOwner = post.user_id === Number(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, content } = body;

  const updated = await updatePost({
    postId: post.id,
    title,
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

  const post = await getPostById(Number(params.id));
  if (!post) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const isOwner = post.user_id === Number(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await deletePost(post.id);
  return NextResponse.json({ ok: true });
}
