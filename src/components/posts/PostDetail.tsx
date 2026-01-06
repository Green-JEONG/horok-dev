import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import type { DbPost } from "@/lib/db";

export default function PostDetail({ post }: { post: DbPost }) {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>{post.category_name}</span>
        <span>·</span>
        <span>{post.author_name}</span>
        <span>·</span>
        <span>{new Date(post.created_at).toLocaleString("ko-KR")}</span>
      </div>

      <hr />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
