import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdByEmail } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ posts: 0, comments: 0, friends: 0 });
    }

    const userId = await getUserIdByEmail(session.user.email);
    if (!userId) {
      return NextResponse.json({ posts: 0, comments: 0, friends: 0 });
    }

    const [posts, comments, friends] = await Promise.all([
      prisma.post.count({
        where: {
          userId: BigInt(userId),
          isDeleted: false,
        },
      }),
      prisma.comment.count({
        where: {
          userId: BigInt(userId),
          isDeleted: false,
        },
      }),
      prisma.friend.count({
        where: {
          userId: BigInt(userId),
        },
      }),
    ]);

    return NextResponse.json({ posts, comments, friends });
  } catch (e) {
    console.error("MYPAGE STATS API ERROR:", e);
    return NextResponse.json({ posts: 0, comments: 0, friends: 0 });
  }
}
