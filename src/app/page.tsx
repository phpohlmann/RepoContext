"use client";

import { DropZone } from "@/components/explorer/drop-zone";
import { FileTree } from "@/components/explorer/file-tree";
import { OutputViewer } from "@/components/preview/output-viewer";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useRepoStore } from "@/store/use-repo-store";

export default function RepoContextPage() {
  const { isProcessing, root } = useRepoStore();

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Header />

      {/* Container for content and sticky viewer */}
      <div className="flex-1 flex flex-col relative max-w-5xl mx-auto w-full px-6 md:px-12">
        <main className="flex-1 py-12">
          {!root && !isProcessing && (
            <section className="space-y-8 animate-in fade-in duration-700">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-extrabold tracking-tight">
                  Package your code for AI.
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  Drag and drop your repository folder to generate a clean,
                  context-rich Markdown file for ChatGPT or Claude.
                </p>
              </div>
              <DropZone />
            </section>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center p-24 space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground font-medium animate-pulse">
                Parsing repository structure...
              </p>
            </div>
          )}

          {root && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight">
                  Project Explorer
                </h3>
                <span className="text-[10px] font-bold uppercase bg-muted px-2 py-1 rounded-md text-muted-foreground tracking-widest border border-border/50">
                  Root: {root.name}
                </span>
              </div>
              <FileTree />
            </div>
          )}
        </main>

        {/* The Viewer is now inside the flex-1 container and uses sticky */}
        <OutputViewer />
      </div>

      <Footer />
    </div>
  );
}
