"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, FileCode } from "lucide-react";
import { useRepoStore } from "@/store/use-repo-store";
import { generateMarkdown } from "@/lib/file-processing/generator";

export function OutputViewer() {
  const { root, selectedPaths } = useRepoStore();
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (!root) return;
    const markdown = await generateMarkdown(root, selectedPaths);

    await navigator.clipboard.writeText(markdown);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  if (selectedPaths.size === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4 bg-white p-4 rounded-2xl shadow-2xl border border-neutral-200 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          Selected
        </span>
        <span className="text-sm font-semibold text-neutral-900">
          {selectedPaths.size} files
        </span>
      </div>

      <div className="w-[1px] h-8 bg-neutral-200" />

      <Button
        onClick={handleCopy}
        className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl px-6"
      >
        {isCopying ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied!
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
