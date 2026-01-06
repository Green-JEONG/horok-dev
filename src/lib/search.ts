import { getStopWords } from "./stopwords";

export async function buildSearchQuery(raw: string): Promise<string[]> {
  const stopWords = await getStopWords();

  return raw
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2)
    .filter((word) => !stopWords.has(word));
}
