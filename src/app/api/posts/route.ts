import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdByEmail } from "@/lib/db";
import { createPost } from "@/lib/posts";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.post.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      user: { select: { email: true, name: true } },
    },
  });

  return NextResponse.json(
    rows.map((post) => ({
      id: Number(post.id),
      title: post.title,
      created_at: post.createdAt.toISOString(),
      category: post.category.name,
      author: post.user.name ?? post.user.email,
    })),
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // DB용 userId 조회 (핵심)
  const userId = await getUserIdByEmail(session.user.email);
  if (!userId) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const { categoryName, title, content } = body;

  if (!categoryName || !title || !content) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const post = await createPost({
    userId,
    categoryName,
    title,
    content,
  });

  return NextResponse.json(post, { status: 201 });
}
