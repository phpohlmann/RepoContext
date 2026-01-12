// MODIFICATION START
"use client";

import React from "react";
import { useRepoStore } from "@/store/use-repo-store";
import { TreeNode } from "./tree-node";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, Search } from "lucide-react";

export function FileTree() {
  const { root, selectAll, deselectAll, isProcessing } = useRepoStore();

  if (!root) return null;

  return (
    <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm">
      {/* Control Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Repository Explorer
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={selectAll}
            disabled={isProcessing}
            className="h-8 text-xs gap-2 hover:bg-secondary"
          >
            <CheckSquare size={14} />
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={deselectAll}
            disabled={isProcessing}
            className="h-8 text-xs gap-2 hover:bg-secondary"
          >
            <Square size={14} />
            None
          </Button>
        </div>
      </div>

      {/* Explorer Content */}
      <div className="max-h-[500px] overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
        <TreeNode node={root} level={0} />
      </div>

      {/* Stats Footer */}
      <div className="px-4 py-2 border-t border-border bg-muted/10 flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Search size={10} />
          Click to toggle folders • Check to select context
        </span>
      </div>
    </div>
  );
}
// MODIFICATION END
