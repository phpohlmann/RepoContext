import { create } from "zustand";
import { countTokens } from "@/lib/tokenizer";

export interface FileNode {
  name: string;
  path: string;
  kind: "file" | "directory";
  children?: FileNode[];
  content?: string;
  tokens?: number;
  entry?: FileSystemEntry;
}

interface IgnoreConfig {
  extensions: string[];
  filenames: string[];
  directories: string[];
}

interface RepoState {
  root: FileNode | null;
  selectedPaths: Set<string>;
  isProcessing: boolean;
  totalTokens: number;
  ignoreConfig: IgnoreConfig;
  setRoot: (node: FileNode | null) => void;
  setProcessing: (status: boolean) => void;
  togglePath: (path: string, checked: boolean) => Promise<void>;
  updateIgnoreConfig: (config: Partial<IgnoreConfig>) => void;
  selectAll: () => Promise<void>;
  deselectAll: () => void;
}

const readFileContent = async (entry: FileSystemFileEntry): Promise<string> => {
  return new Promise((resolve, reject) => {
    entry.file((file) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    }, reject);
  });
};

export const useRepoStore = create<RepoState>((set, get) => ({
  root: null,
  selectedPaths: new Set(),
  isProcessing: false,
  totalTokens: 0,
  ignoreConfig: {
    extensions: ["svg", "png", "jpg", "ico", "lock", "pdf"],
    filenames: [".ds_store", "package-lock.json", "yarn.lock", ".env"],
    directories: ["node_modules", ".next", ".git", "dist", "build"],
  },

  setRoot: (node) =>
    set({ root: node, selectedPaths: new Set(), totalTokens: 0 }),
  setProcessing: (status) => set({ isProcessing: status }),
  updateIgnoreConfig: (config) =>
    set((state) => ({ ignoreConfig: { ...state.ignoreConfig, ...config } })),
  deselectAll: () => set({ selectedPaths: new Set(), totalTokens: 0 }),

  selectAll: async () => {
    const { root } = get();
    if (!root) return;
    set({ isProcessing: true });
    console.time("Select All Processing");

    const newSelected = new Set<string>();
    let fileCount = 0;

    const traverse = async (node: FileNode) => {
      newSelected.add(node.path);
      if (node.kind === "file") {
        fileCount++;
        if (!node.content && node.entry?.isFile) {
          node.content = await readFileContent(
            node.entry as FileSystemFileEntry
          );
          node.tokens = countTokens(node.content);
        }
      }
      if (node.children) {
        // Parallel recursion
        await Promise.all(node.children.map((child) => traverse(child)));
      }
    };

    await traverse(root);

    let total = 0;
    const calculate = (node: FileNode) => {
      if (node.kind === "file") total += node.tokens || 0;
      node.children?.forEach(calculate);
    };
    calculate(root);

    console.log(`Processed ${fileCount} files.`);
    console.timeEnd("Select All Processing");
    set({
      selectedPaths: newSelected,
      totalTokens: total,
      isProcessing: false,
    });
  },

  togglePath: async (path, checked) => {
    const { root, selectedPaths } = get();
    if (!root) return;
    set({ isProcessing: true });
    console.time(`Toggle: ${path}`);

    const newSelected = new Set(selectedPaths);

    const findAndToggle = async (
      node: FileNode,
      targetPath: string,
      isParentMatching: boolean
    ) => {
      const isMatch = node.path === targetPath || isParentMatching;

      if (isMatch) {
        if (checked) {
          newSelected.add(node.path);
          if (node.kind === "file" && !node.content && node.entry?.isFile) {
            node.content = await readFileContent(
              node.entry as FileSystemFileEntry
            );
            node.tokens = countTokens(node.content);
          }
        } else {
          newSelected.delete(node.path);
        }
      }

      if (node.children) {
        // Parallel recursion for high speed
        await Promise.all(
          node.children.map((child) =>
            findAndToggle(child, targetPath, isMatch)
          )
        );
      }
    };

    await findAndToggle(root, path, false);

    let newTotal = 0;
    const calculate = (node: FileNode) => {
      if (node.kind === "file" && newSelected.has(node.path))
        newTotal += node.tokens || 0;
      node.children?.forEach(calculate);
    };
    calculate(root);

    console.timeEnd(`Toggle: ${path}`);
    set({
      selectedPaths: newSelected,
      totalTokens: newTotal,
      isProcessing: false,
    });
  },
}));
