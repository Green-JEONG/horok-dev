"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  postId: number;
  initialTitle: string;
  initialContent: string;
  initialCategoryName: string;
  isOwner: boolean;
};

export default function PostActions({
  postId,
  initialTitle,
  initialContent,
  initialCategoryName,
  isOwner,
}: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [categoryName, setCategoryName] = useState(initialCategoryName);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOwner) return null;

  async function handleUpdate() {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedCategoryName = categoryName.trim().replace(/^#/, "");

    if (!trimmedTitle || !trimmedContent || !trimmedCategoryName) {
      setError("제목, 태그, 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedContent,
          categoryName: trimmedCategoryName,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message ?? "게시글 수정에 실패했습니다.");
        return;
      }

      setTitle(trimmedTitle);
      setContent(trimmedContent);
      setCategoryName(trimmedCategoryName);
      setIsEditing(false);
      router.refresh();
    } catch {
      setError("게시글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("이 게시글을 삭제할까요?");
    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message ?? "게시글 삭제에 실패했습니다.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("게시글 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex justify-end gap-2 text-sm">
        <button
          type="button"
          disabled={isSubmitting || isDeleting}
          onClick={() => {
            setIsEditing((prev) => !prev);
            setError(null);
          }}
          className="rounded-md border px-3 py-1 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isEditing ? "닫기" : "수정"}
        </button>

        <button
          type="button"
          disabled={isSubmitting || isDeleting}
          onClick={handleDelete}
          className="rounded-md border px-3 py-1 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "삭제 중..." : "삭제"}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="제목"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <input
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="태그"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={10}
            placeholder="내용"
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setTitle(initialTitle);
                setContent(initialContent);
                setCategoryName(initialCategoryName);
                setIsEditing(false);
                setError(null);
              }}
              className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              취소
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleUpdate}
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "저장 중..." : "수정 저장"}
            </button>
          </div>
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : null}
    </div>
  );
}
