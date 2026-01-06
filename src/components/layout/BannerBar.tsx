"use client";

import { useEffect, useState } from "react";

const messages = [
  "호록 기술 블로그가 2026년 1월 6일부로 개설되었어요! 많은 관심 가져 주세요.  🎉",
  "2026년 붉은🔥 말🐴의 해가 밝았어요. 새해 복 많이 받으세요!",
];

export default function BannerBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-primary">
      <div className="mx-auto max-w-6x text-center pt-4 pb-3">
        {/* 메시지 */}
        <p className="text-sm font-medium text-primary-foreground">
          {messages[index]}
        </p>

        {/* 페이지 인디케이터 */}
        <div className="flex justify-center gap-2 mt-3">
          {messages.map((message, i) => (
            <button
              key={message}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`배너 ${i + 1}`}
              className={`
      h-1.5 w-1.5 rounded-full transition-all
      ${i === index ? "bg-primary-foreground" : "bg-primary-foreground/40"}
    `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
