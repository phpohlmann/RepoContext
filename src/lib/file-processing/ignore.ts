export interface IgnoreConfig {
  extensions: string[];
  filenames: string[];
  directories: string[];
  gitIgnored: string[];
}

export function parseGitignore(text: string): string[] {
  return (
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => (line.endsWith("/") ? line.slice(0, -1) : line))
  );
}

export function shouldIgnore(
  name: string,
  isDirectory: boolean,
  config: IgnoreConfig
): boolean {
  const lowerName = name.toLowerCase();

  if (isDirectory && config.directories.includes(lowerName)) return true;

  const extension = lowerName.split(".").pop() || "";
  if (
    config.filenames.includes(lowerName) ||
    config.extensions.includes(extension)
  )
    return true;

  return config.gitIgnored.includes(lowerName);
}
