type Comment = {
  id: number;
  content: string;
  created_at: string;
  author: string;
};

export default function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{comment.author}</span>
        <span className="text-muted-foreground">
          {new Date(comment.created_at).toLocaleString("ko-KR")}
        </span>
      </div>

      <p className="mt-2 whitespace-pre-wrap text-sm">{comment.content}</p>
    </div>
  );
}
