"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostEditor() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const categoryName = tags
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .find(Boolean);

    if (!trimmedTitle || !trimmedContent || !categoryName) {
      setError("제목, 태그, 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedContent,
          categoryName,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message ?? "게시글 저장에 실패했습니다.");
        return;
      }

      if (payload?.id) {
        router.push(`/posts/${payload.id}`);
        router.refresh();
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("게시글 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full border-b px-1 py-2 text-xl font-semibold outline-none placeholder:text-muted-foreground"
      />

      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="태그 입력 (#React 또는 React, 첫 번째 태그가 카테고리로 저장됩니다)"
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="글을 작성해보세요..."
        rows={14}
        className="w-full resize-none rounded-md border px-3 py-3 text-sm leading-relaxed"
      />

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => router.back()}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          취소
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "게시 중..." : "게시하기"}
        </button>
      </div>
    </section>
  );
}
