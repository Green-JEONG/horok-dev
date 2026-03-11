"use client";

import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useNicknameAvailability } from "@/components/auth/useNicknameAvailability";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AccountSettingsModal({ open, onClose }: Props) {
  const { data: session, update } = useSession();

  const initialName = useMemo(
    () => session?.user?.name ?? "",
    [session?.user?.name],
  );

  const [name, setName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const nickname = useNicknameAvailability({
    nickname: name,
    excludeUserId: session?.user?.id,
    initialNickname: initialName,
    enabled: open,
  });
  const isNicknameUnavailable =
    nickname.status === "taken" ||
    nickname.status === "invalid" ||
    nickname.status === "error";

  // 모달 열릴 때 값 초기화
  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setMessage(null);
  }, [open, initialName]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSave() {
    setMessage(null);

    if (!session?.user?.id) {
      setMessage("세션 정보를 찾지 못했습니다. 다시 로그인 해주세요.");
      return;
    }

    if (!nickname.isAvailable) {
      setMessage(nickname.message ?? "사용 가능한 닉네임을 입력해주세요.");
      return;
    }

    if (newPassword || newPasswordConfirm) {
      if (!currentPassword) {
        setMessage("현재 비밀번호를 입력해주세요.");
        return;
      }
      if (newPassword.length < 4) {
        setMessage("새 비밀번호를 4자 이상으로 입력해주세요.");
        return;
      }
      if (newPassword !== newPasswordConfirm) {
        setMessage("새 비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    setLoading(true);
    try {
      type UpdateUserResponse = {
        message?: string;
      };

      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data: UpdateUserResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data?.message ?? "수정에 실패했습니다.");
        return;
      }

      // 세션 UI 즉시 반영 (NextAuth useSession().update)
      await update?.({ name });

      setMessage("저장되었습니다.");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-60">
      {/* overlay */}
      <button
        type="button"
        aria-label="설정 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 cursor-default"
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-background text-foreground shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-base font-semibold">계정 설정</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 hover:bg-muted"
              aria-label="닫기"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-muted-foreground">
                닉네임
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="닉네임"
                className={cn(
                  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none",
                  nickname.status === "taken" ||
                    nickname.status === "invalid" ||
                    nickname.status === "error"
                    ? "border-red-500 focus-visible:border-red-500"
                    : "",
                  nickname.status === "available"
                    ? "border-green-500 focus-visible:border-green-500"
                    : "",
                )}
              />
              {nickname.message && (
                <p
                  className={cn(
                    "text-xs",
                    nickname.status === "available" ? "text-green-600" : "",
                    isNicknameUnavailable
                      ? "text-red-500"
                      : "text-muted-foreground",
                  )}
                >
                  {nickname.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold">비밀번호 변경</p>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-muted-foreground">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-muted-foreground">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-muted-foreground">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                비밀번호를 변경하지 않으려면 아래 칸은 비워두세요.
              </p>
            </div>

            {message && <p className="text-sm text-red-500">{message}</p>}
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm hover:bg-muted"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || nickname.isChecking}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
