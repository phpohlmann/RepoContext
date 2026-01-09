"use client";

import React, { useState } from "react";
import { Copy, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRepoStore } from "@/store/use-repo-store";
import { formatTokenCount } from "@/lib/tokenizer";
import { generateMarkdown } from "@/lib/file-processing/generator";
import { cn } from "@/lib/utils";

export function OutputViewer() {
  const { root, selectedPaths, totalTokens, isProcessing } = useRepoStore();
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (!root || selectedPaths.size === 0) return;

    try {
      const markdown = await generateMarkdown(root, selectedPaths);
      await navigator.clipboard.writeText(markdown);

      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (selectedPaths.size === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-card/80 backdrop-blur-xl p-4 pr-2 rounded-2xl shadow-2xl border border-border transition-all duration-300 z-50",
        isProcessing && "opacity-50 pointer-events-none"
      )}
    >
      <div className="flex flex-col pl-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
          Estimated Tokens
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-mono font-bold text-primary">
            {formatTokenCount(totalTokens)}
          </span>
          {/* Note: Removed 'title' prop as it's not supported directly on Lucide components in this TS version */}
          <Info size={12} className="text-muted-foreground" />
        </div>
      </div>

      <div className="w-px h-10 bg-border" />

      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
          Files Selected
        </span>
        <span className="text-lg font-semibold text-foreground">
          {selectedPaths.size}
        </span>
      </div>

      <Button
        onClick={handleCopy}
        disabled={isProcessing}
        className={cn(
          "h-12 px-8 rounded-xl font-bold transition-all ml-4",
          isCopying
            ? "bg-green-600 hover:bg-green-600 text-white"
            : "bg-primary text-primary-foreground hover:opacity-90"
        )}
      >
        {isCopying ? (
          <>
            <Check className="w-5 h-5 mr-2 stroke-[3px]" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy for AI
          </>
        )}
      </Button>
    </div>
  );
}
