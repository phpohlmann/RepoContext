"use client";

import React, { useState, useRef } from "react";
import { Flame, Info, FileWarning, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRepoStore, FileNode } from "@/store/use-repo-store";
import { formatTokenCount } from "@/lib/tokenizer";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OutlierList() {
  const { root, selectedPaths, togglePath } = useRepoStore();
  const [dismissedPaths, setDismissedPaths] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!root || selectedPaths.size === 0) return null;

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const getOutliers = (node: FileNode): FileNode[] => {
    const files: FileNode[] = [];
    const traverse = (n: FileNode) => {
      if (n.kind === "file" && n.tokens && !dismissedPaths.has(n.path)) {
        files.push(n);
      }
      n.children?.forEach(traverse);
    };
    traverse(node);
    return files.sort((a, b) => (b.tokens || 0) - (a.tokens || 0)).slice(0, 5);
  };

  const outliers = getOutliers(root);

  const handleDismiss = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const newDismissed = new Set(dismissedPaths);
    newDismissed.add(path);
    setDismissedPaths(newDismissed);
  };

  if (outliers.length === 0) return null;

  return (
    <div className="flex items-center" onMouseLeave={handleMouseLeave}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            onMouseEnter={handleMouseEnter}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 transition-all rounded-md hover:bg-orange-500/10 animate-pulse cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>Large Files</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          onMouseEnter={handleMouseEnter}
          className="w-80 p-0 bg-background border-border shadow-xl overflow-hidden pointer-events-auto"
          align="end"
        >
          <div className="p-4 bg-orange-500/5 border-b border-border flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-orange-500" />
            <h4 className="font-bold text-sm tracking-tight text-foreground uppercase">
              Top 5 Context Heavyweights
            </h4>
          </div>

          <div className="divide-y divide-border max-h-60 overflow-y-auto">
            {outliers.map((file) => {
              const isSelected = selectedPaths.has(file.path);
              return (
                <div
                  key={file.path}
                  className="p-3 hover:bg-accent/50 transition-colors flex items-center gap-3 group"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      togglePath(file.path, !!checked)
                    }
                    className="border-orange-500/50 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 cursor-pointer"
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-xs font-bold truncate transition-colors",
                        isSelected
                          ? "text-foreground"
                          : "text-muted-foreground line-through opacity-50"
                      )}
                    >
                      {file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate italic">
                      {file.path}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-500">
                      {formatTokenCount(file.tokens || 0)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                      onClick={(e) => handleDismiss(e, file.path)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-muted/30 text-[10px] text-muted-foreground flex items-center gap-2">
            <Info size={12} />
            <span>Uncheck to save tokens, or dismiss to hide.</span>
          </div>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border mx-2" />
    </div>
  );
}
