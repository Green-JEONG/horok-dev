import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: { isDeleted: false },
          },
        },
      },
    },
  });

  return NextResponse.json(
    rows
      .map((category) => ({
        id: Number(category.id),
        name: category.name,
        postCount: category._count.posts,
      }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 10),
  );
}
