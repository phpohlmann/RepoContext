// MODIFICATION START
"use client";

import { Settings2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRepoStore } from "@/store/use-repo-store";

export function SettingsSidebar() {
  const { ignoreConfig, updateIgnoreConfig } = useRepoStore();

  const handleUpdate = (key: keyof typeof ignoreConfig, value: string) => {
    const arrayValue = value
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    updateIgnoreConfig({ [key]: arrayValue });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-md hover:bg-secondary">
          <Settings2 className="w-4 h-4" />
          Settings
        </button>
      </SheetTrigger>
      {/* CRITICAL: Added bg-background and opacity-100 to fix transparency */}
      <SheetContent className="w-full sm:max-w-md bg-background opacity-100 border-l border-border shadow-2xl p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b border-border flex flex-row items-center justify-between space-y-0">
            <div>
              <SheetTitle className="text-xl font-bold tracking-tight">
                Project Rules
              </SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure exclusion filters for your scan.
              </p>
            </div>
            {/* Custom Close for cleaner look */}
            <SheetClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="dirs"
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Ignored Directories
              </Label>
              <Input
                id="dirs"
                defaultValue={ignoreConfig.directories.join(", ")}
                onBlur={(e) => handleUpdate("directories", e.target.value)}
                className="bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary h-11"
                placeholder="node_modules, .git, dist..."
              />
              <p className="text-[11px] text-muted-foreground italic">
                Folders matching these names will be skipped
              </p>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="exts"
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Ignored Extensions
              </Label>
              <Input
                id="exts"
                defaultValue={ignoreConfig.extensions.join(", ")}
                onBlur={(e) => handleUpdate("extensions", e.target.value)}
                className="bg-secondary/30 border-border focus-visible:ring-1 focus-visible:ring-primary h-11"
                placeholder="png, jpg, pdf..."
              />
            </div>

            <div className="mt-auto p-4 rounded-xl bg-secondary/20 border border-border/50">
              <div className="flex gap-3">
                <div className="w-1 h-auto bg-primary/40 rounded-full" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground block mb-1">
                    Local Privacy
                  </span>
                  All scanning and tokenization happens strictly in your
                  browser. No code is ever uploaded to our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
// MODIFICATION END
