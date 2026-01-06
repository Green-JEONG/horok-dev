import { findPostById } from "@/lib/db";
import PostDetail from "@/components/posts/PostDetail";

type Props = {
  params: { id: string };
};

export default async function PostPage({ params }: Props) {
  const postId = Number(params.id);

  if (Number.isNaN(postId)) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        잘못된 게시글 접근입니다.
      </div>
    );
  }

  const post = await findPostById(postId);

  if (!post) {
    return <div className="py-20 text-center">게시글이 없습니다.</div>;
  }

  return <PostDetail post={post} />;
}
