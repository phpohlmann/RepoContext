import { getEncoding } from "js-tiktoken";

const encoding = getEncoding("cl100k_base");

export function countTokens(text: string): number {
  if (!text) return 0;
  try {
    return encoding.encode(text).length;
  } catch (error) {
    console.error("Tokenization error:", error);
    return 0;
  }
}

export function formatTokenCount(count: number): string {
  if (count < 1000) return count.toString();
  return (count / 1000).toFixed(1) + "k";
}
