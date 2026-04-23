import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "c.horok | 서비스 선택",
  description:
    "호록 컴퍼니 소개와 기술 블로그, 코딩테스트, 기술 영상, 호록샵으로 이동할 수 있는 포털 페이지",
  alternates: {
    canonical: "/",
  },
};

const services = [
  {
    href: "/horok-tech",
    eyebrow: "Horok Tech",
    title: "호록 기술 블로그",
    description: "개발 기록, 회고, 학습 메모를 차곡차곡 쌓아가는 메인 공간",
  },
  {
    href: "/horok-cote",
    eyebrow: "Horok Cote",
    title: "코딩테스트",
    description: "문제 풀이 정리, 알고리즘 학습, 풀이 패턴 아카이브",
  },
  {
    href: "/horok-tv",
    eyebrow: "Horok TV",
    title: "기술 영상",
    description: "기술 발표, 데모, 튜토리얼을 모아보는 영상 허브",
  },
  {
    href: "/horok-shop",
    eyebrow: "Horok Shop",
    title: "호록샵",
    description: "브랜드 굿즈와 프로젝트 상품을 만나는 쇼핑 공간",
  },
];

export default function Page() {
  return (
    <div className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.28),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.2),_transparent_28%),linear-gradient(180deg,_#1b1208_0%,_#25160b_38%,_#0d1b12_100%)] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.32em] text-amber-200/80">
            c.horok gateway
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              호록의 네 가지 공간으로
              <br />
              바로 들어가세요.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
              기술 블로그를 중심으로 코딩테스트 아카이브와 기술 영상 공간을
              분리하고, 호록샵까지 연결해 서비스 성격에 맞게 탐색할 수 있도록
              구성했습니다.
            </p>
          </div>
        </div>

        <section className="mt-10 w-full rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/80">
                About Horok Company
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                호록 컴퍼니는 기록과 공유를 서비스로 만드는 팀입니다.
              </h2>
              <p className="text-sm leading-7 text-stone-300 sm:text-base">
                개발자의 배움과 실험, 아카이빙, 콘텐츠 경험을 하나의 브랜드로
                연결합니다. 기술 블로그부터 코딩테스트, 영상, 커머스까지 각각의
                서비스가 분리되어 있으면서도 하나의 생태계처럼 이어지도록
                설계하고 있습니다.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-stone-300 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-amber-400/15 bg-black/15 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">
                  Mission
                </p>
                <p className="mt-2 leading-6">
                  배우고 만든 것을 남기고, 더 많은 사람에게 닿게 합니다.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-400/15 bg-black/15 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/80">
                  Services
                </p>
                <p className="mt-2 leading-6">
                  Tech, Cote, TV, Shop으로 이어지는 호록의 브랜드 경험
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-amber-300/35 hover:bg-white/10"
            >
              <div className="flex h-full flex-col justify-between gap-10">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/80 group-hover:text-emerald-200/90">
                    {service.eyebrow}
                  </p>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-white">
                      {service.title}
                    </h2>
                    <p className="text-sm leading-6 text-stone-300">
                      {service.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-emerald-200 transition group-hover:text-white">
                  바로 이동하기 →
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
