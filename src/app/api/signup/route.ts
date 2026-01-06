import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("SIGNUP BODY:", body);
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { message: "필수 값이 누락되었습니다." },
        { status: 400 },
      );
    }

    // 이미 존재하는 이메일인지 확인
    const exists = await findUserByEmail(email);
    if (exists) {
      return NextResponse.json(
        { message: "이미 사용 중인 이메일입니다." },
        { status: 409 },
      );
    }

    // 비밀번호 해시
    const hashed = await bcrypt.hash(password, 10);

    await createUser({
      email,
      name,
      passwordHash: hashed,
      role: "USER",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("SIGNUP ERROR:", e);
    return NextResponse.json({ message: "회원가입 실패" }, { status: 500 });
  }
}
