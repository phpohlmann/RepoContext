export const DEFAULT_IGNORE_DIRS = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".vscode",
];
export const DEFAULT_IGNORE_FILES = [
  "package-lock.json",
  "yarn.lock",
  ".env",
  ".DS_Store",
];
export const DEFAULT_IGNORE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "ico",
  "woff",
  "woff2",
  "pdf",
];

export function shouldIgnore(name: string, isDirectory: boolean): boolean {
  const lowerName = name.toLowerCase();

  if (isDirectory) {
    return DEFAULT_IGNORE_DIRS.includes(lowerName);
  }

  const extension = lowerName.split(".").pop() || "";

  return (
    DEFAULT_IGNORE_FILES.includes(lowerName) ||
    DEFAULT_IGNORE_EXTENSIONS.includes(extension)
  );
}
