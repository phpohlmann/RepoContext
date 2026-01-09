"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileNode, useRepoStore } from "@/store/use-repo-store";

interface TreeNodeProps {
  node: FileNode;
  level: number;
}

export function TreeNode({ node, level }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedPaths, togglePath } = useRepoStore();

  const isSelected = selectedPaths.has(node.path);
  const isDirectory = node.kind === "directory";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirectory) setIsOpen(!isOpen);
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    togglePath(node.path, e.target.checked);
  };

  return (
    <div className="select-none">
      <div
        onClick={handleToggle}
        className={cn(
          "flex items-center py-1 px-2 hover:bg-neutral-100 rounded-md cursor-pointer transition-colors group",
          isSelected ? "text-neutral-900" : "text-neutral-500"
        )}
        style={{ paddingLeft: `${level * 16}px` }}
      >
        <div className="flex items-center gap-2 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckbox}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
          />

          <span className="w-4 h-4 flex items-center justify-center">
            {isDirectory &&
              (isOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              ))}
          </span>

          {isDirectory ? (
            <Folder
              className={cn(
                "w-4 h-4",
                isSelected ? "text-neutral-900" : "text-neutral-400"
              )}
            />
          ) : (
            <FileText className="w-4 h-4 text-neutral-400" />
          )}

          <span className="text-sm font-medium truncate">{node.name}</span>
        </div>
      </div>

      {isDirectory && isOpen && node.children && (
        <div className="transition-all">
          {node.children.map((child) => (
            <TreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
