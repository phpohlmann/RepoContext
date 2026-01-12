import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

export interface IgnoreConfig {
  extensions: string[];
  filenames: string[];
  directories: string[];
  gitIgnored: string[];
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
  applyIgnoreRules: () => Promise<void>;
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

const deepCloneNode = (node: FileNode): FileNode => {
  const clone: FileNode = {
    ...node,
    children: node.children
      ? node.children.map((child) => deepCloneNode(child))
      : undefined,
  };
  return clone;
};

export const useRepoStore = create<RepoState>()(
  persist(
    (set, get) => ({
      root: null,
      selectedPaths: new Set(),
      isProcessing: false,
      totalTokens: 0,
      ignoreConfig: {
        extensions: ["svg", "png", "jpg", "ico", "lock", "pdf"],
        filenames: [".ds_store", "package-lock.json", "yarn.lock", ".env"],
        directories: ["node_modules", ".next", ".git", "dist", "build"],
        gitIgnored: [],
      },

      setRoot: (node) =>
        set({ root: node, selectedPaths: new Set(), totalTokens: 0 }),
      setProcessing: (status) => set({ isProcessing: status }),
      deselectAll: () => set({ selectedPaths: new Set(), totalTokens: 0 }),

      updateIgnoreConfig: (config) => {
        set((state) => ({
          ignoreConfig: { ...state.ignoreConfig, ...config },
        }));
        get().applyIgnoreRules();
      },

      applyIgnoreRules: async () => {
        const { root, ignoreConfig, selectedPaths } = get();
        if (!root) return;
        set({ isProcessing: true });
        await new Promise((resolve) => setTimeout(resolve, 50));
        const newSelectedPaths = new Set(selectedPaths);

        const prune = async (node: FileNode): Promise<FileNode | null> => {
          const name = node.name.toLowerCase();
          const isDir = node.kind === "directory";
          if (isDir && ignoreConfig.directories.includes(name)) return null;
          if (!isDir) {
            const ext = name.split(".").pop() || "";
            if (
              ignoreConfig.filenames.includes(name) ||
              ignoreConfig.extensions.includes(ext)
            ) {
              newSelectedPaths.delete(node.path);
              return null;
            }
          }
          if (ignoreConfig.gitIgnored.includes(name)) {
            newSelectedPaths.delete(node.path);
            return null;
          }
          if (node.children) {
            const children = await Promise.all(
              node.children.map((child) => prune(child))
            );
            node.children = children.filter(
              (child): child is FileNode => child !== null
            );
          }
          return node;
        };

        const clonedRoot = deepCloneNode(root);
        const newRoot = await prune(clonedRoot);

        let newTotal = 0;
        const calculate = (node: FileNode) => {
          if (node.kind === "file" && newSelectedPaths.has(node.path)) {
            newTotal += node.tokens || 0;
          }
          node.children?.forEach(calculate);
        };
        if (newRoot) calculate(newRoot);
        set({
          root: newRoot,
          selectedPaths: newSelectedPaths,
          totalTokens: newTotal,
          isProcessing: false,
        });
      },

      selectAll: async () => {
        const { root } = get();
        if (!root) return;
        set({ isProcessing: true });
        const allPaths = new Set<string>();
        let tokens = 0;

        const traverse = async (node: FileNode) => {
          allPaths.add(node.path);
          if (node.kind === "file") {
            if (!node.content && node.entry?.isFile) {
              try {
                const content = await readFileContent(
                  node.entry as FileSystemFileEntry
                );
                node.content = content;
                node.tokens = await countTokens(content);
              } catch (e) {
                console.error(`Read error: ${node.path}`, e);
              }
            }
            tokens += node.tokens || 0;
          }
          if (node.children) {
            await Promise.all(node.children.map((child) => traverse(child)));
          }
        };

        await traverse(root);
        set({
          selectedPaths: allPaths,
          totalTokens: tokens,
          isProcessing: false,
        });
      },

      togglePath: async (path, checked) => {
        const { root, selectedPaths } = get();
        if (!root) return;
        set({ isProcessing: true });
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
                try {
                  const content = await readFileContent(
                    node.entry as FileSystemFileEntry
                  );
                  node.content = content;
                  node.tokens = await countTokens(content);
                } catch (e) {
                  console.error(`Read error: ${node.path}`, e);
                }
              }
            } else {
              newSelected.delete(node.path);
            }
          }
          if (node.children) {
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
          if (node.kind === "file" && newSelected.has(node.path)) {
            newTotal += node.tokens || 0;
          }
          node.children?.forEach(calculate);
        };
        calculate(root);
        set({
          selectedPaths: newSelected,
          totalTokens: newTotal,
          isProcessing: false,
        });
      },
    }),
    {
      name: "repocontext-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ignoreConfig: state.ignoreConfig }),
    }
  )
);
