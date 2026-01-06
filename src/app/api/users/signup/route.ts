import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    email?: string;
    password?: string;
    name?: string;
  };
  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password || password.length < 4) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const exists = await findUserByEmail(email);
  if (exists) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    email,
    passwordHash,
    name: body.name ?? null,
  });

  return NextResponse.json(
    { id: user?.id, email: user?.email },
    { status: 201 },
  );
}
