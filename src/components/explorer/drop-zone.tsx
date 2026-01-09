"use client";

import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRepoStore } from "@/store/use-repo-store";
import { scanDirectory } from "@/lib/file-processing/scanner";

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const { setRoot, setProcessing } = useRepoStore();

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
    const tree = await scanDirectory(entry);
    setRoot(tree);
    setProcessing(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-200",
        "bg-neutral-50/50 border-neutral-200 hover:border-neutral-300",
        isDragging && "border-neutral-900 bg-neutral-100/50 scale-[1.01]"
      )}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadCloud
          className={cn(
            "w-12 h-12 mb-4 transition-colors",
            isDragging ? "text-neutral-900" : "text-neutral-400"
          )}
        />
        <p className="mb-2 text-sm text-neutral-700">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-xs text-neutral-500">
          Drop your project folder here to begin
        </p>
      </div>
    </div>
  );
}
