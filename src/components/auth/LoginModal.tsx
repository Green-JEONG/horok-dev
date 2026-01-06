"use client";

import { useCallback } from "react";
import { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type AuthStep = "login" | "signup";

export default function LoginModal({ open, onClose }: Props) {
  const [step, setStep] = useState<AuthStep>("login");

  // 로그인 입력 state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 회원가입용 state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");

  const handleClose = useCallback(() => {
    onClose();
    setStep("login");
    setEmail("");
    setPassword("");
    setError(null);
  }, [onClose]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  async function handleCredentialsLogin() {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    if (res?.ok) {
      handleClose(); // 로그인 성공 → 모달 닫기
    }
  }

  if (!open) return null;

  async function handleSignup() {
    console.log({
      signupEmail,
      signupName,
      signupPassword,
      signupPasswordConfirm,
    });

    if (
      !signupEmail ||
      !signupName ||
      !signupPassword ||
      !signupPasswordConfirm
    ) {
      setError("모든 값을 입력해주세요.");
      return;
    }

    if (signupPassword !== signupPasswordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signupEmail,
        name: signupName,
        password: signupPassword,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.message ?? "회원가입 실패");
      return;
    }

    // 회원가입 성공 → 자동 로그인
    const loginRes = await signIn("credentials", {
      email: signupEmail,
      password: signupPassword,
      redirect: false,
    });

    if (loginRes?.ok) {
      handleClose();
    } else {
      setError("회원가입 후 로그인 실패");
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* dim overlay */}
      <button
        type="button"
        aria-label="로그인 모달 닫기"
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 cursor-default"
      >
        <span className="sr-only">모달 닫기</span>
      </button>

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-sm rounded-xl bg-background p-6 shadow-lg">
          {/* 상단 네비 */}
          <div className="absolute left-5 top-5 flex items-center gap-2">
            {step === "signup" && (
              <button
                type="button"
                onClick={() => setStep("login")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={20} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>

          {/* 로고 */}
          <div className="my-6 flex flex-col items-center">
            <Image src="/logo.svg" alt="Horok Tech" width={60} height={60} />
            <h2 className="text-lg font-bold mt-2">
              {step === "login" ? "Horok Tech" : "회원가입"}
            </h2>
          </div>

          {/* 로그인 */}
          {step === "login" && (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCredentialsLogin();
                }}
                className="space-y-3"
              >
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="아이디 (이메일)"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button
                  type="submit"
                  onClick={handleCredentialsLogin}
                  disabled={loading}
                  className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {loading ? "로그인 중..." : "로그인"}
                </button>
              </form>

              <div className="mt-6 space-y-3">
                <p className="text-center text-xs text-muted-foreground">
                  소셜 로그인
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => signIn("github")}
                    className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted"
                  >
                    <Image
                      src="/github.svg"
                      alt="github logo"
                      width={32}
                      height={32}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => signIn("google")}
                    className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted"
                  >
                    <Image
                      src="/google.svg"
                      alt="google logo"
                      width={28}
                      height={28}
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                onClick={() => setStep("signup")}
                className="mt-6 w-full rounded-md bg-green-500 py-2 text-sm font-semibold text-primary-foreground"
              >
                회원가입
              </button>
            </>
          )}

          {/* ===== 회원가입 ===== */}
          {step === "signup" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCredentialsLogin();
              }}
              className="space-y-3"
            >
              <input
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="아이디 (이메일)"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="닉네임"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                type="password"
                value={signupPasswordConfirm}
                onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                placeholder="비밀번호 확인"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                onClick={handleSignup}
                disabled={loading}
                className="mt-4 w-full rounded-md bg-green-500 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? "가입 중..." : "회원가입"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
