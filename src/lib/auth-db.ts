import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getUserIdByEmail } from "@/lib/db";

export async function requireDbUserId(): Promise<number> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthenticated");
  }

  const userId = await getUserIdByEmail(session.user.email);
  if (!userId) {
    throw new Error("User not found");
  }

  return userId;
}

export async function getDbUserIdFromSession() {
  const session = await auth();
  if (!session?.user?.email) return null;

  return getUserIdByEmail(session.user.email);
}
