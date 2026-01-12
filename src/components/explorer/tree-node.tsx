// MODIFICATION START
"use client";

import React, { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(level < 1); // Auto-open root
  const { selectedPaths, togglePath, isProcessing } = useRepoStore();

  const isSelected = selectedPaths.has(node.path);
  const isDirectory = node.kind === "directory";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirectory) setIsOpen(!isOpen);
  };

  return (
    <div className="group">
      <div
        onClick={handleToggle}
        className={cn(
          "flex items-center py-1.5 px-2 hover:bg-accent/50 cursor-pointer transition-all duration-150 relative border-l-2 border-transparent",
          isSelected && "bg-primary/5 border-l-primary/50",
          isProcessing && "opacity-60 pointer-events-none"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Visual Depth Line */}
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
            className="h-4 w-4 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
                "text-sm truncate transition-colors",
                isSelected
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {node.name}
            </span>
          </div>
        </div>

        {/* Token Badge for Files */}
        {!isDirectory && node.tokens !== undefined && isSelected && (
          <div className="ml-2 flex items-center">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground border border-border">
              {formatTokenCount(node.tokens)}
            </span>
          </div>
        )}

        {/* Chevron only for directories */}
        {isDirectory && (
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
      </div>

      {isDirectory && isOpen && node.children && (
        <div className="animate-in fade-in slide-in-from-left-1 duration-200">
          {node.children.map((child) => (
            <TreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
// MODIFICATION END
