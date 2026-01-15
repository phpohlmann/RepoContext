// MODIFICATION START
"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileNode, useRepoStore } from "@/store/use-repo-store";
import { Checkbox } from "@/components/ui/checkbox";
import { formatTokenCount } from "@/lib/tokenizer";

interface TreeNodeProps {
  node: FileNode;
  level: number;
}

const FileIcon = ({
  name,
  isSelected,
}: {
  name: string;
  isSelected: boolean;
}) => {
  const ext = name.split(".").pop()?.toLowerCase();
  const className = cn(
    "w-4 h-4",
    isSelected ? "text-primary" : "text-muted-foreground/70"
  );
  if (["js", "ts", "jsx", "tsx"].includes(ext || ""))
    return <FileCode className={className} />;
  if (["json", "yaml", "yml"].includes(ext || ""))
    return <FileJson className={className} />;
  if (["md", "txt"].includes(ext || ""))
    return <FileText className={className} />;
  return <Hash className={className} />;
};

export function TreeNode({ node, level }: TreeNodeProps) {
  const { selectedPaths, togglePath, isProcessing, searchQuery } =
    useRepoStore();

  // 1. Local State
  const [isOpen, setIsOpen] = useState(level < 1);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  const isSelected = selectedPaths.has(node.path);
  const isDirectory = node.kind === "directory";

  // 🧠 PROXIMITY SEARCH LOGIC
  const searchResults = useMemo(() => {
    if (!searchQuery)
      return { isVisible: true, isDirectMatch: false, shouldExpand: false };
    const query = searchQuery.toLowerCase();

    const checkNode = (n: FileNode): boolean => {
      if (n.name.toLowerCase().includes(query)) return true;
      if (n.children) return n.children.some((child) => checkNode(child));
      return false;
    };

    const isDirectMatch = node.name.toLowerCase().includes(query);
    const hasMatchingDescendant = node.children?.some((child) =>
      checkNode(child)
    );
    const isVisible = isDirectMatch || hasMatchingDescendant;

    return { isVisible, isDirectMatch, shouldExpand: hasMatchingDescendant };
  }, [node, searchQuery]);

  /**
   * 🛠️ SENIOR FIX: Adjusting state during render
   * This replaces useEffect to avoid cascading renders and satisfy the linter.
   */
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    if (searchQuery && searchResults.shouldExpand) {
      setIsOpen(true);
    }
  }

  if (searchQuery && !searchResults.isVisible) return null;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirectory) setIsOpen(!isOpen);
  };

  return (
    <div className="group animate-in fade-in duration-200">
      <div
        onClick={handleToggle}
        className={cn(
          "flex items-center py-1.5 px-2 hover:bg-accent/50 cursor-pointer transition-all duration-150 relative border-l-2 border-transparent",
          isSelected && "bg-primary/5 border-l-primary/50",
          isProcessing && "opacity-60 pointer-events-none",
          searchQuery &&
            !searchResults.isDirectMatch &&
            "opacity-40 grayscale-[0.5]"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {level > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 w-px bg-border/40 group-hover:bg-border transition-colors"
            style={{ left: `${level * 16 - 4}px` }}
          />
        )}

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => togglePath(node.path, !!checked)}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
          />

          <div className="flex items-center gap-2 min-w-0">
            {isDirectory ? (
              <>
                {isOpen ? (
                  <FolderOpen className="w-4 h-4 text-primary fill-primary/10" />
                ) : (
                  <Folder className="w-4 h-4 text-muted-foreground/70" />
                )}
              </>
            ) : (
              <FileIcon name={node.name} isSelected={isSelected} />
            )}

            <span
              className={cn(
                "text-sm truncate transition-all",
                isSelected
                  ? "text-foreground font-medium"
                  : "text-muted-foreground",
                searchQuery &&
                  searchResults.isDirectMatch &&
                  "text-primary font-bold scale-105 origin-left"
              )}
            >
              {node.name}
            </span>
          </div>
        </div>

        {!isDirectory && node.tokens !== undefined && isSelected && (
          <div className="ml-2 flex items-center">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border">
              {formatTokenCount(node.tokens)}
            </span>
          </div>
        )}

        {isDirectory && (
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            {isOpen ? (
              <ChevronDown size={14} className="cursor-pointer" />
            ) : (
              <ChevronRight size={14} className="cursor-pointer" />
            )}
          </div>
        )}
      </div>

      {isDirectory && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
// MODIFICATION END
