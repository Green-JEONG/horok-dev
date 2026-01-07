import { Suspense } from "react";
import PostList from "@/components/posts/PostList";
import PostListHeader from "@/components/posts/PostListHeader";

export default function FeedPage() {
  return (
    <div className="space-y-6">
      <Suspense
        fallback={<div className="h-6 w-32 rounded bg-muted animate-pulse" />}
      >
        <PostListHeader />
      </Suspense>
      <PostList />
    </div>
  );
}
