export async function normalizeQuery(raw: string): Promise<string> {
  return raw
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // 특수문자 제거
    .split(/\s+/)
    .filter((word) => word.length >= 2)
    .map((word) => `+${word}*`) // Boolean mode 대응
    .join(" ");
}
