"use client";

import React from "react";
import { useRepoStore } from "@/store/use-repo-store";
import { TreeNode } from "./tree-node";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, ShieldCheck } from "lucide-react";

export function FileTree() {
  const { root, selectAll, deselectAll, isProcessing, ignoreConfig } =
    useRepoStore();

  if (!root) return null;

  const hasGitignore =
    ignoreConfig.gitIgnored && ignoreConfig.gitIgnored.length > 0;

  return (
    <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Repository Explorer
          </h3>

          {hasGitignore && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full animate-in fade-in slide-in-from-left-2 duration-700">
              <ShieldCheck size={10} className="text-primary" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">
                .gitignore active
              </span>
            </div>
          )}
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

      <div className="max-h-125 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
        <TreeNode node={root} level={0} />
      </div>

      <div className="px-4 py-2 border-t border-border bg-muted/10 flex justify-between items-center text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1 text-[10px]">
          Click to toggle folders • Check to select context
        </span>
        {hasGitignore && (
          <span className="italic">
            {ignoreConfig.gitIgnored.length} custom rules applied
          </span>
        )}
      </div>
    </div>
  );
}
