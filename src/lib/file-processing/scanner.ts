import { FileNode } from "@/store/use-repo-store";
import { shouldIgnore } from "./ignore";

export async function scanDirectory(
  entry: FileSystemEntry,
  path: string = ""
): Promise<FileNode | null> {
  if (shouldIgnore(entry.name, entry.isDirectory)) {
    return null;
  }

  const currentPath = path ? `${path}/${entry.name}` : entry.name;

  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    return new Promise((resolve) => {
      fileEntry.file(() => {
        resolve({
          name: entry.name,
          path: currentPath,
          kind: "file",
        });
      });
    });
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
        entries.map((child) => scanDirectory(child, currentPath))
      )
    ).filter((child): child is FileNode => child !== null);

    return {
      name: entry.name,
      path: currentPath,
      kind: "directory",
      children: children.filter((child): child is FileNode => child !== null),
    };
  }

  return null;
}
