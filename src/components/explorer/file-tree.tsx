"use client";

import React from "react";
import { useRepoStore } from "@/store/use-repo-store";
import { TreeNode } from "./tree-node";
import { Button } from "@/components/ui/button";

export function FileTree() {
  const { root, selectAll, deselectAll } = useRepoStore();

  if (!root) return null;

  return (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="bg-neutral-50 p-3 border-b flex justify-between items-center">
        <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">
          Explorer
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={selectAll}
            className="text-xs h-8"
          >
            Select All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={deselectAll}
            className="text-xs h-8"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="p-2 max-h-[600px] overflow-y-auto">
        <TreeNode node={root} level={0} />
      </div>
    </div>
  );
}
