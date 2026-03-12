import { getCommentsByPost } from "@/lib/comments";
import CommentItem from "./CommentItem";

export default async function CommentList({ postId }: { postId: number }) {
  const comments = await getCommentsByPost(postId);

  return (
    <section className="mt-16">
      <h3 className="mb-4 text-lg font-semibold">댓글 {comments.length}</h3>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
