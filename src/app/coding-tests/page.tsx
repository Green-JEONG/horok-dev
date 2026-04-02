import type { Metadata } from "next";
import PostListHeader from "@/components/posts/PostListHeader";

export const metadata: Metadata = {
  title: "코딩테스트 | c.horok",
  description: "코딩테스트 콘텐츠 페이지",
};

export default function CodingTestsPage() {
  return (
    <section>
      <div className="space-y-3">
        <PostListHeader title="코딩테스트" showWriteButton={false} />
        <p className="text-sm text-muted-foreground">
          코딩테스트 콘텐츠는 현재 준비 중입니다.
        </p>
      </div>
    </section>
  );
}
