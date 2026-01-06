import { NextResponse } from "next/server";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/categories";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Number(url.searchParams.get("limit") ?? "10");

  if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
    return NextResponse.json(
      { message: "Invalid pagination params" },
      { status: 400 },
    );
  }

  const category = await getCategoryBySlug(slug);
  if (!category) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 },
    );
  }

  const { posts, total } = await getPostsByCategory({
    categoryId: category.id,
    page,
    limit,
  });

  return NextResponse.json({
    category,
    pagination: {
      page,
      limit,
      total,
    },
    posts,
  });
}
