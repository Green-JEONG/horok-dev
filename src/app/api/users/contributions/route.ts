import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { findUserContributions } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    console.log("SESSION:", session);

    if (!session?.user?.id) {
      console.log("NO SESSION USER");
      return NextResponse.json([], { status: 200 });
    }

    const userId = Number(session.user.id);

    console.log("USER ID (raw):", session.user.id);
    console.log("USER ID (number):", userId);

    const data = await findUserContributions(userId);

    console.log("CONTRIBUTIONS FROM DB:", data);

    return NextResponse.json(data);
  } catch (err) {
    console.error("[contributions API error]", err);
    return NextResponse.json([], { status: 200 });
  }
}
