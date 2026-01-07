import { Suspense } from "react";
import PostListHeader from "@/components/posts/PostListHeader";
import LikedPostList from "@/components/posts/LikedPostList";

export default function LikesPage() {
  return (
    <div className="space-y-4">
      <Suspense
        fallback={<div className="h-6 w-32 rounded bg-muted animate-pulse" />}
      >
        <PostListHeader />
      </Suspense>

      <LikedPostList />
    </div>
  );
}
