import type { DbPost } from "@/lib/db";

export default function PostHeader({ post }: { post: DbPost }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>

      <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{post.author_name}</span>
        <span>·</span>
        <time>{new Date(post.created_at).toLocaleString("ko-KR")}</time>
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
          #{post.category_name}
        </span>
      </div>

      <hr className="mt-6" />
    </header>
  );
}
