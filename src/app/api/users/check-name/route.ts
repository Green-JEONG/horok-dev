import { NextResponse } from "next/server";
import { findUserByName } from "@/lib/db";
import { normalizeNickname, validateNickname } from "@/lib/nickname";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = normalizeNickname(searchParams.get("name") ?? "");
  const excludeUserId = searchParams.get("excludeUserId") ?? undefined;

  const validationMessage = validateNickname(name);
  if (validationMessage) {
    return NextResponse.json(
      { available: false, message: validationMessage },
      { status: 400 },
    );
  }

  const user = await findUserByName(name, excludeUserId);

  if (user) {
    return NextResponse.json(
      { available: false, message: "이미 사용 중인 닉네임입니다." },
      { status: 200 },
    );
  }

  return NextResponse.json({
    available: true,
    message: "사용 가능한 닉네임입니다.",
  });
}
