"use client";

import { Settings2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
          <Settings2 className="w-4 h-4" />
          Settings
        </button>
      </SheetTrigger>
      <SheetContent className="bg-white border-l border-neutral-200 w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-neutral-900">
            Project Rules
          </SheetTitle>
          <p className="text-sm text-neutral-500">
            Define what RepoContext should ignore.
          </p>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dirs">Ignored Directories</Label>
            <Input
              id="dirs"
              defaultValue={ignoreConfig.directories.join(", ")}
              onBlur={(e) => handleUpdate("directories", e.target.value)}
              placeholder="node_modules, .git, dist..."
            />
            <p className="text-[10px] text-neutral-400">Separate with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exts">Ignored Extensions</Label>
            <Input
              id="exts"
              defaultValue={ignoreConfig.extensions.join(", ")}
              onBlur={(e) => handleUpdate("extensions", e.target.value)}
              placeholder="png, jpg, mp4..."
            />
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <p className="text-xs text-neutral-500 leading-relaxed">
              <strong>Tip:</strong> Updating these settings will affect the next
              folder you drop. RepoContext is a privacy-first tool; all
              filtering happens locally in your browser.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
