import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { hasLiked, getLikeCount } from "@/lib/likes";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const postId = Number(id);
  if (Number.isNaN(postId)) {
    return NextResponse.json({ message: "Invalid post id" }, { status: 400 });
  }

  const session = await auth();
  const userId = session ? Number(session.user.id) : null;

  const liked =
    userId !== null && !Number.isNaN(userId)
      ? await hasLiked(postId, userId)
      : false;

  const likeCount = await getLikeCount(postId);

  return NextResponse.json({
    liked,
    likeCount,
  });
}
