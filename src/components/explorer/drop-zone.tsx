"use client";

import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRepoStore } from "@/store/use-repo-store";
import { scanDirectory } from "@/lib/file-processing/scanner";

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const { setRoot, setProcessing, ignoreConfig } = useRepoStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (!items || items.length === 0) return;

    const entry = items[0].webkitGetAsEntry();
    if (!entry) return;

    setProcessing(true);

    const tree = await scanDirectory(entry, ignoreConfig);

    setRoot(tree);
    setProcessing(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-xl transition-all duration-200",
        "bg-muted/20 border-border hover:border-primary/50 hover:bg-muted/40",
        isDragging && "border-primary bg-primary/5 scale-[1.01]"
      )}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
        <div
          className={cn(
            "p-4 rounded-full bg-background border border-border mb-4 transition-colors",
            isDragging ? "text-primary border-primary" : "text-muted-foreground"
          )}
        >
          <UploadCloud className="w-8 h-8" />
        </div>
        <p className="mb-2 text-sm text-foreground">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
          Select your local repository folder to start packaging your context.
        </p>
      </div>
    </div>
  );
}
