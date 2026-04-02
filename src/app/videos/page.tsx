import type { Metadata } from "next";
import PostListHeader from "@/components/posts/PostListHeader";

export const metadata: Metadata = {
  title: "영상 | c.horok",
  description: "영상 콘텐츠 페이지",
};

export default function VideosPage() {
  return (
    <section>
      <div className="space-y-3">
        <PostListHeader title="영상" showWriteButton={false} />
        <p className="text-sm text-muted-foreground">
          영상 콘텐츠는 현재 준비 중입니다.
        </p>
      </div>
    </section>
  );
}
