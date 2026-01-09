"use client";

import { DropZone } from "@/components/explorer/drop-zone";
import { useRepoStore } from "@/store/use-repo-store";

export default function RepoContextPage() {
  const { isProcessing, root } = useRepoStore();

  return (
    <main className="max-w-6xl mx-auto p-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          RepoContext
        </h1>
        <p className="text-neutral-500 text-lg">
          Turn your codebase into LLM-ready context.
        </p>
      </header>

      {!root && <DropZone />}

      {isProcessing && (
        <div className="flex items-center justify-center p-12">
          <p className="animate-pulse text-neutral-400 font-medium">
            Analyzing repository structure...
          </p>
        </div>
      )}

      {root && (
        <div className="p-4 border rounded-lg bg-neutral-50 border-neutral-200">
          <p className="text-sm text-neutral-600 italic">
            Success! File tree for{" "}
            <span className="font-bold">{root.name}</span> ready for selection.
          </p>
        </div>
      )}
    </main>
  );
}
