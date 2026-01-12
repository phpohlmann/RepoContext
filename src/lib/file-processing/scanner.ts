import { FileNode } from "@/store/use-repo-store";
import { shouldIgnore, IgnoreConfig } from "./ignore";

export async function scanDirectory(
  entry: FileSystemEntry,
  config: IgnoreConfig,
  path: string = ""
): Promise<FileNode | null> {
  if (shouldIgnore(entry.name, entry.isDirectory, config)) {
    return null;
  }

  const currentPath = path ? `${path}/${entry.name}` : entry.name;

  if (entry.isFile) {
    return {
      name: entry.name,
      path: currentPath,
      kind: "file",
      entry: entry,
    };
  }

  if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry;
    const reader = dirEntry.createReader();

    const entries = await new Promise<FileSystemEntry[]>((resolve) => {
      const allEntries: FileSystemEntry[] = [];
      const readBatch = () => {
        reader.readEntries((batch) => {
          if (batch.length === 0) resolve(allEntries);
          else {
            allEntries.push(...batch);
            readBatch();
          }
        });
      };
      readBatch();
    });

    const children = (
      await Promise.all(
        entries.map((child) => scanDirectory(child, config, currentPath))
      )
    ).filter((child): child is FileNode => child !== null);

    return {
      name: entry.name,
      path: currentPath,
      kind: "directory",
      children,
      entry: entry,
    };
  }

  return null;
}
