import type { Tiktoken } from "js-tiktoken";

let encodingCache: Tiktoken | null = null;

async function getTokenizer(): Promise<Tiktoken> {
  if (encodingCache) return encodingCache;

  const { getEncoding } = await import("js-tiktoken");
  encodingCache = getEncoding("cl100k_base");
  return encodingCache;
}

export async function countTokens(text: string): Promise<number> {
  if (!text) return 0;
  try {
    const tokenizer = await getTokenizer();
    return tokenizer.encode(text).length;
  } catch (error) {
    console.error("Tokenization error:", error);
    return 0;
  }
}

export function formatTokenCount(count: number): string {
  if (count < 1000) return count.toString();
  return (count / 1000).toFixed(1) + "k";
}
