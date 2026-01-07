import { getStopWords } from "@/lib/stopwords";

export async function normalizeQuery(raw: string): Promise<string> {
  const stopWords = await getStopWords();

  return raw
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1 && !stopWords.has(word))
    .join(" ");
}
