import { create } from "zustand";

export interface FileNode {
  name: string;
  path: string;
  kind: "file" | "directory";
  children?: FileNode[];
  content?: string;
  tokens?: number;
}

interface RepoState {
  root: FileNode | null;
  selectedPaths: Set<string>;
  isProcessing: boolean;
  totalTokens: number;
  ignoreConfig: {
    extensions: string[];
    filenames: string[];
    directories: string[];
  };

  setRoot: (node: FileNode | null) => void;
  togglePath: (path: string, checked: boolean) => void;
  setProcessing: (status: boolean) => void;
  updateIgnoreConfig: (config: Partial<RepoState["ignoreConfig"]>) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

const getAllFilePaths = (node: FileNode): string[] => {
  let paths: string[] = [node.path];
  if (node.children) {
    node.children.forEach((child) => {
      paths = [...paths, ...getAllFilePaths(child)];
    });
  }
  return paths;
};

export const useRepoStore = create<RepoState>((set, get) => ({
  root: null,
  selectedPaths: new Set(),
  isProcessing: false,
  totalTokens: 0,
  ignoreConfig: {
    extensions: ["svg", "png", "jpg", "ico", "lock"],
    filenames: [".ds_store", "package-lock.json", "yarn.lock", ".env"],
    directories: ["node_modules", ".next", ".git", "dist", "build"],
  },

  setRoot: (node) =>
    set({
      root: node,
      selectedPaths: node ? new Set(getAllFilePaths(node)) : new Set(),
    }),

  setProcessing: (status) => set({ isProcessing: status }),

  updateIgnoreConfig: (config) =>
    set((state) => ({
      ignoreConfig: { ...state.ignoreConfig, ...config },
    })),

  togglePath: (path, checked) => {
    const { root, selectedPaths } = get();
    if (!root) return;

    const newSelected = new Set(selectedPaths);

    const findNode = (node: FileNode, targetPath: string): FileNode | null => {
      if (node.path === targetPath) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child, targetPath);
          if (found) return found;
        }
      }
      return null;
    };

    const targetNode = findNode(root, path);
    if (targetNode) {
      const pathsToUpdate = getAllFilePaths(targetNode);
      pathsToUpdate.forEach((p) => {
        if (checked) newSelected.add(p);
        else newSelected.delete(p);
      });
    }

    set({ selectedPaths: newSelected });
  },

  selectAll: () => {
    const { root } = get();
    if (root) {
      set({ selectedPaths: new Set(getAllFilePaths(root)) });
    }
  },

  deselectAll: () => set({ selectedPaths: new Set() }),
}));
