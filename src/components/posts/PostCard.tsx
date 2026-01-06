import Image from "next/image";
import Link from "next/link";

type Props = {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  likes: number;
  comments: number;
  createdAt: Date;
  thumbnail?: string | null;
};

export default function PostCard({
  id,
  title,
  thumbnail,
  description,
  category,
  author,
  likes,
  comments,
  createdAt,
}: Props) {
  return (
    <Link
      href={`/posts/${id}`}
      className="group overflow-hidden rounded-xl border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-28 items-center justify-center bg-zinc-900">
        <Image
          src={thumbnail ?? "/thumbnails/default.png"}
          alt={title}
          width={48}
          height={48}
        />
      </div>

      <div className="p-3">
        <p className="mb-1 text-xs text-muted-foreground">
          {category} · {author}
        </p>

        <h3 className="mb-1 line-clamp-1 text-sm font-semibold">{title}</h3>

        <p className="mb-3 line-clamp-1 text-xs text-muted-foreground">
          {description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>❤️ {likes}</span>
            <span>💬 {comments}</span>
          </div>
          <span>{new Date(createdAt).toLocaleDateString("ko-KR")}</span>
        </div>
      </div>
    </Link>
  );
}
