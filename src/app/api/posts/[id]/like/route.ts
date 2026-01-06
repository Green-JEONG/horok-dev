import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { hasLiked, addLike, removeLike, getLikeCount } from "@/lib/likes";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);
  if (Number.isNaN(postId)) {
    return NextResponse.json({ message: "Invalid post id" }, { status: 400 });
  }

  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json(
      { message: "Invalid user id in session" },
      { status: 500 },
    );
  }

  const liked = await hasLiked(postId, userId);

  if (liked) {
    await removeLike(postId, userId);
  } else {
    await addLike(postId, userId);
  }

  const likeCount = await getLikeCount(postId);

  return NextResponse.json({
    liked: !liked,
    likeCount,
  });
}
