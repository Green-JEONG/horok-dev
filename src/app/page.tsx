import PostList from "@/components/posts/PostList";
import PostListHeader from "@/components/posts/PostListHeader";
import ContributionGrid from "@/components/contributions/ContributionGrid";

export default async function Page() {
  return (
    <div className="space-y-6">
      <ContributionGrid />
      <PostListHeader />
      <PostList />
    </div>
  );
}
