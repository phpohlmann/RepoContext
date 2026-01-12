"use client";

import { Flame, Info, FileWarning } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRepoStore, FileNode } from "@/store/use-repo-store";
import { formatTokenCount } from "@/lib/tokenizer";

export function OutlierList() {
  const { root } = useRepoStore();

  if (!root) return null;

  // Logic: Find top 5 files by token count
  const getOutliers = (node: FileNode): FileNode[] => {
    const files: FileNode[] = [];
    const traverse = (n: FileNode) => {
      if (n.kind === "file" && n.tokens) {
        files.push(n);
      }
      n.children?.forEach(traverse);
    };
    traverse(node);
    // Sort descending and take top 5
    return files.sort((a, b) => (b.tokens || 0) - (a.tokens || 0)).slice(0, 5);
  };

  const outliers = getOutliers(root);

  if (outliers.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 transition-all rounded-md hover:bg-orange-500/10 animate-pulse">
          <Flame className="w-4 h-4" />
          <span>Large Files</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-background border-border shadow-xl overflow-hidden"
        align="end"
      >
        <div className="p-4 bg-orange-500/5 border-b border-border flex items-center gap-2">
          <FileWarning className="w-4 h-4 text-orange-500" />
          <h4 className="font-bold text-sm tracking-tight text-foreground uppercase">
            Top 5 Context Heavyweights
          </h4>
        </div>

        <div className="divide-y divide-border max-h-60 overflow-y-auto">
          {outliers.map((file, idx) => (
            <div
              key={file.path}
              className="p-3 hover:bg-accent/50 transition-colors flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate italic">
                  {file.path}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-orange-500">
                  {formatTokenCount(file.tokens || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-muted/30 text-[10px] text-muted-foreground flex items-center gap-2">
          <Info size={12} />
          <span>
            These files consume the most AI context. Consider ignoring them if
            they aren&apos;t essential.
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}