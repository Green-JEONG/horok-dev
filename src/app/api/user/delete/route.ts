import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { deleteUserById } from "@/lib/db";

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "인증되지 않은 사용자" },
        { status: 401 },
      );
    }

    await deleteUserById(session.user.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("회원탈퇴 실패:", error);
    return NextResponse.json({ message: "회원탈퇴 실패" }, { status: 500 });
  }
}
