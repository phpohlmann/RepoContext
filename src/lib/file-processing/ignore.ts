export interface IgnoreConfig {
  extensions: string[];
  filenames: string[];
  directories: string[];
}

export function shouldIgnore(
  name: string,
  isDirectory: boolean,
  config: IgnoreConfig
): boolean {
  const lowerName = name.toLowerCase();

  if (isDirectory) {
    return config.directories.includes(lowerName);
  }

  const extension = lowerName.split(".").pop() || "";

  return (
    config.filenames.includes(lowerName) ||
    config.extensions.includes(extension)
  );
}
