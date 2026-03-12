import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function loadEnvFile(filePath, override = false) {
  const absolutePath = resolve(process.cwd(), filePath);
  if (!existsSync(absolutePath)) return;

  const source = readFileSync(absolutePath, "utf8");

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    if (!key) continue;
    if (!override && process.env[key] !== undefined) continue;

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isMockPost(post) {
  const title = normalizeText(post.title);
  const content = normalizeText(post.content);

  return (
    title === "첫 번째 게시글" ||
    content === "메인 카드 테스트용 게시글입니다." ||
    /관련 테스트 게시글입니다\.$/.test(content)
  );
}

loadEnvFile(".env");
loadEnvFile(".env.local", true);

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

const dryRun = process.argv.includes("--dry-run");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      select: { id: true },
    }),
    prisma.post.findMany({
      orderBy: [{ id: "asc" }],
      select: {
        id: true,
        userId: true,
        title: true,
        content: true,
        user: { select: { email: true, name: true } },
      },
    }),
  ]);

  const existingUserIds = new Set(users.map((user) => user.id.toString()));
  const duplicateKeyToKeepId = new Map();
  const mockPostIds = [];
  const duplicatePostIds = [];
  const invalidUserPostIds = [];

  for (const post of posts) {
    const postId = post.id.toString();
    const userId = post.userId.toString();

    if (!existingUserIds.has(userId) || !post.user) {
      invalidUserPostIds.push(post.id);
      continue;
    }

    if (isMockPost(post)) {
      mockPostIds.push(post.id);
      continue;
    }

    const duplicateKey = `${normalizeText(post.title)}\n${normalizeText(post.content)}`;

    if (duplicateKeyToKeepId.has(duplicateKey)) {
      duplicatePostIds.push(post.id);
      continue;
    }

    duplicateKeyToKeepId.set(duplicateKey, postId);
  }

  const idsToDelete = [
    ...mockPostIds,
    ...duplicatePostIds,
    ...invalidUserPostIds,
  ];

  const summary = {
    dryRun,
    totalPostsBefore: posts.length,
    mockPosts: mockPostIds.map(String),
    duplicatePosts: duplicatePostIds.map(String),
    invalidUserPosts: invalidUserPostIds.map(String),
    deleteCount: idsToDelete.length,
  };

  if (dryRun || idsToDelete.length === 0) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  await prisma.$transaction([
    prisma.post.deleteMany({
      where: { id: { in: idsToDelete } },
    }),
  ]);

  const remainingPosts = await prisma.post.findMany({
    orderBy: [{ id: "asc" }],
    select: {
      id: true,
      title: true,
      userId: true,
      user: { select: { email: true, name: true } },
    },
  });

  console.log(
    JSON.stringify(
      {
        ...summary,
        totalPostsAfter: remainingPosts.length,
        remainingPosts: remainingPosts.map((post) => ({
          id: post.id.toString(),
          userId: post.userId.toString(),
          title: post.title,
          authorEmail: post.user?.email ?? null,
          authorName: post.user?.name ?? null,
        })),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
