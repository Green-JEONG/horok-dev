import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("Missing DATABASE_URL");

export const pool = mysql.createPool(DATABASE_URL);

export type DbUser = {
  id: string;
  email: string;
  password: string | null;
  name: string | null;
  role: "USER" | "ADMIN";
  provider: "credentials" | "github";
  github_id: string | null;
};

export async function findUserByEmail(email: string) {
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  return (rows[0] as DbUser | undefined) ?? null;
}

export async function createUser(params: {
  email: string;
  passwordHash: string;
  name?: string | null;
  role?: "USER" | "ADMIN";
}) {
  const { email, passwordHash, name = null, role = "USER" } = params;

  await pool.query(
    "INSERT INTO users (email, password, name, role, provider) VALUES (?, ?, ?, ?, 'credentials')",
    [email, passwordHash, name, role],
  );

  return findUserByEmail(email);
}

export async function deleteUserById(userId: string) {
  await pool.query("DELETE FROM users WHERE id = ?", [userId]);
}

export async function upsertOAuthUser(params: {
  email: string;
  name?: string | null;
  provider: "github" | "google";
  providerId: string;
}) {
  const { email, name = null, provider, providerId } = params;

  await pool.query(
    `
    INSERT INTO users (email, name, role, provider, provider_id)
    VALUES (?, ?, 'USER', ?, ?)
    ON DUPLICATE KEY UPDATE
      name = COALESCE(VALUES(name), name),
      provider = VALUES(provider),
      provider_id = VALUES(provider_id)
    `,
    [email, name, provider, providerId],
  );

  return findUserByEmail(email);
}
