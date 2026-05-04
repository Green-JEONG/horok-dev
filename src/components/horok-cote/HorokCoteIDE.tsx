"use client";

import { Code2, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { HorokCoteProblem } from "@/lib/horok-cote";
import { cn } from "@/lib/utils";

type Language = "python" | "java" | "cpp";

type RunResult = "idle" | "success" | "failure";

type HorokCoteIDEProps = {
  problem: HorokCoteProblem;
};

const languageMeta: Record<
  Language,
  {
    label: string;
    runtime: string;
    fileName: string;
    badgeClassName: string;
    tabClassName: string;
  }
> = {
  python: {
    label: "Python 3",
    runtime: "python3",
    fileName: "main.py",
    badgeClassName: "bg-[#eef7f1] text-[#2d8f52]",
    tabClassName: "bg-[#f8fffb] text-[#2d8f52]",
  },
  java: {
    label: "Java 21",
    runtime: "java",
    fileName: "Main.java",
    badgeClassName: "bg-sky-100 text-sky-700",
    tabClassName: "bg-[#f8fafc] text-sky-700",
  },
  cpp: {
    label: "C++17",
    runtime: "cpp17",
    fileName: "main.cpp",
    badgeClassName: "bg-violet-100 text-violet-700",
    tabClassName: "bg-violet-50 text-violet-700",
  },
};

export default function HorokCoteIDE({ problem }: HorokCoteIDEProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");
  const [editedCodes, setEditedCodes] = useState(problem.starterCodes);
  const [runResult, setRunResult] = useState<RunResult>("idle");
  const currentLanguage = languageMeta[selectedLanguage];
  const code = editedCodes[selectedLanguage];
  const lineCount = Math.max(code.split("\n").length, 12);
  const lineNumbers = Array.from(
    { length: lineCount },
    (_, index) => index + 1,
  );

  function handleRun() {
    const normalizedCode = code.replace(/\s+/g, " ").trim();
    const isSuccess = normalizedCode.includes("Hello, Horok!");

    setRunResult(isSuccess ? "success" : "failure");
  }

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] dark:border-slate-800 dark:bg-[linear-gradient(180deg,#111827_0%,#0f172a_100%)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800 sm:px-5">
        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <Code2 className="size-4 text-[#44bb68]" />
          <span className="font-semibold">horok IDE</span>
          <span className="text-slate-400 dark:text-slate-500">
            {currentLanguage.fileName} | {currentLanguage.label}
          </span>
        </div>
        <Button
          size="sm"
          onClick={handleRun}
          className="bg-[#44bb68] text-white hover:bg-[#389d58]"
        >
          <Play className="size-4" />
          실행
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            {(["python", "java", "cpp"] as Language[]).map((language) => {
              const meta = languageMeta[language];
              const isActive = selectedLanguage === language;

              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(language);
                    setRunResult("idle");
                  }}
                  className={cn(
                    "rounded-full px-3 py-1 font-medium transition",
                    isActive
                      ? meta.badgeClassName
                      : "bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100",
                  )}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
          <span>{currentLanguage.label} 선택됨</span>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto]">
          <div className="min-h-0 overflow-hidden">
            <div className="grid h-full min-h-0 grid-cols-[56px_minmax(0,1fr)] bg-white dark:bg-slate-950">
              <div className="border-r border-slate-200 bg-slate-50 px-2 py-5 font-mono text-[13px] leading-6 text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
                {lineNumbers.map((lineNumber) => (
                  <div key={lineNumber} className="text-right">
                    {lineNumber}
                  </div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(event) => {
                  setEditedCodes((current) => ({
                    ...current,
                    [selectedLanguage]: event.target.value,
                  }));
                  setRunResult("idle");
                }}
                spellCheck={false}
                className="h-full min-h-[360px] w-full resize-none bg-white px-4 py-5 font-mono text-[13px] leading-6 text-slate-800 outline-none dark:bg-slate-950 dark:text-slate-100"
                aria-label={`${currentLanguage.label} 코드 에디터`}
              />
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                실행 결과
              </p>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  runResult === "success"
                    ? "bg-emerald-100 text-emerald-700"
                    : runResult === "failure"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-200 text-slate-600",
                )}
              >
                {runResult === "success"
                  ? "성공"
                  : runResult === "failure"
                    ? "실패"
                    : "대기 중"}
              </span>
            </div>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {runResult === "success" && (
                <p>
                  정답 형식으로 보입니다. 현재 코드에서 `Hello, Horok!` 출력이
                  확인되었습니다.
                </p>
              )}
              {runResult === "failure" && (
                <p>
                  실패했습니다. `Hello, Horok!` 문장을 정확히 출력하도록 코드를
                  수정해 보세요.
                </p>
              )}
              {runResult === "idle" && (
                <p>
                  코드를 작성한 뒤 실행 버튼을 누르면 성공 또는 실패가
                  표시됩니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
