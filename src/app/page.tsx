import PostList from "@/components/posts/PostList";
import PostListHeader from "@/components/posts/PostListHeader";

export default async function Page() {
  return (
    <div className="space-y-6">
      <PostListHeader />
      <PostList />
    </div>
  );
}
