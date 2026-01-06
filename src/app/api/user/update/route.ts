import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { pool } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const currentPassword =
      typeof body?.currentPassword === "string" ? body.currentPassword : null;
    const newPassword =
      typeof body?.newPassword === "string" ? body.newPassword : null;

    // 이름만 바꾸는 것도 허용
    if (!name && !newPassword) {
      return NextResponse.json(
        { message: "수정할 값이 없습니다." },
        { status: 400 },
      );
    }

    // 현재 유저 조회
    type UserRow = RowDataPacket & {
      id: string;
      password: string | null;
      provider: "credentials" | "github" | "google";
    };

    const [rows] = await pool.query<UserRow[]>(
      "SELECT id, password, provider FROM users WHERE id = ? LIMIT 1",
      [session.user.id],
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 비번 변경 요청이 있으면 검증
    let passwordToSave: string | null = null;

    if (newPassword) {
      // credentials 사용자만 비번 변경 가능 (oauth는 원칙적으로 불가)
      if (user.provider !== "credentials") {
        return NextResponse.json(
          { message: "소셜 로그인 계정은 비밀번호를 변경할 수 없습니다." },
          { status: 400 },
        );
      }
      if (!user.password) {
        return NextResponse.json(
          { message: "비밀번호 정보가 없습니다." },
          { status: 400 },
        );
      }
      if (!currentPassword) {
        return NextResponse.json(
          { message: "현재 비밀번호를 입력해주세요." },
          { status: 400 },
        );
      }

      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) {
        return NextResponse.json(
          { message: "현재 비밀번호가 올바르지 않습니다." },
          { status: 400 },
        );
      }

      passwordToSave = await bcrypt.hash(newPassword, 10);
    }

    // 업데이트
    if (passwordToSave && name) {
      await pool.query("UPDATE users SET name = ?, password = ? WHERE id = ?", [
        name,
        passwordToSave,
        session.user.id,
      ]);
    } else if (passwordToSave) {
      await pool.query("UPDATE users SET password = ? WHERE id = ?", [
        passwordToSave,
        session.user.id,
      ]);
    } else {
      await pool.query("UPDATE users SET name = ? WHERE id = ?", [
        name,
        session.user.id,
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "계정 수정 실패" }, { status: 500 });
  }
}
