import { prisma } from "@/lib/prisma";

export async function hasLiked(postId: number, userId: number) {
  const like = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId: BigInt(postId),
        userId: BigInt(userId),
      },
    },
    select: { postId: true },
  });

  return Boolean(like);
}

export async function addLike(postId: number, userId: number) {
  await prisma.postLike.create({
    data: {
      postId: BigInt(postId),
      userId: BigInt(userId),
    },
  });
}

export async function removeLike(postId: number, userId: number) {
  await prisma.postLike.delete({
    where: {
      postId_userId: {
        postId: BigInt(postId),
        userId: BigInt(userId),
      },
    },
  });
}

export async function getLikeCount(postId: number) {
  return prisma.postLike.count({
    where: { postId: BigInt(postId) },
  });
}

export async function toggleLike({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}) {
  const liked = await hasLiked(postId, userId);

  if (liked) {
    await removeLike(postId, userId);
  } else {
    await addLike(postId, userId);
  }

  const likeCount = await getLikeCount(postId);

  return {
    liked: !liked,
    likeCount,
  };
}
