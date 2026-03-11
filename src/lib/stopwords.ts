import { prisma } from "@/lib/prisma";

let cachedStopWords: Set<string> | null = null;
let cachedAt = 0;
const TTL = 1000 * 60 * 10;

export async function getStopWords(): Promise<Set<string>> {
  const now = Date.now();

  if (cachedStopWords && now - cachedAt < TTL) {
    return cachedStopWords;
  }

  const rows = await prisma.stopWord.findMany({
    select: { word: true },
  });

  cachedStopWords = new Set(rows.map((row) => row.word.toLowerCase()));
  cachedAt = now;

  return cachedStopWords;
}
