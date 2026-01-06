import { NextResponse } from "next/server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // 로그인 안 한 경우
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 관리자 권한 아님
  if (session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 통과
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
