export function normalizeNickname(name: string) {
  return name.trim();
}

export function validateNickname(name: string) {
  const normalizedName = normalizeNickname(name);

  if (!normalizedName) {
    return "닉네임을 입력해주세요.";
  }

  return null;
}
