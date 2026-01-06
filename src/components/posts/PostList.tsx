import { findPostsPaged } from "@/lib/db";
import PostListInfinite from "./PostListInfinite";

export default async function PostList() {
  const initialPosts = await findPostsPaged(12, 0);

  return <PostListInfinite initialPosts={initialPosts} />;
}
