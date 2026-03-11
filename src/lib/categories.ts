import { prisma } from "@/lib/prisma";

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });

  return category
    ? {
        id: Number(category.id),
        name: category.name,
        slug: category.slug,
      }
    : null;
}

export async function getPostsByCategory(params: {
  categoryId: number;
  page: number;
  limit: number;
}) {
  const { categoryId, page, limit } = params;
  const offset = (page - 1) * limit;
  const where = {
    categoryId: BigInt(categoryId),
    isDeleted: false,
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        user: {
          select: { email: true },
        },
        _count: {
          select: { likes: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: posts.map((post) => ({
      id: Number(post.id),
      title: post.title,
      created_at: post.createdAt.toISOString(),
      author: post.user.email,
      likeCount: post._count.likes,
    })),
    total,
  };
}
