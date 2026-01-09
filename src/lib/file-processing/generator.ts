import { FileNode } from "@/store/use-repo-store";

export async function generateMarkdown(
  root: FileNode,
  selectedPaths: Set<string>
): Promise<string> {
  let output = "# Project Context\n\n";
  output += `Generated on: ${new Date().toLocaleString()}\n\n`;

  async function traverse(node: FileNode) {
    // Only process files that are selected
    if (node.kind === "file" && selectedPaths.has(node.path)) {
      output += `## File: ${node.path}\n`;
      output += "---\n";

      // We wrap the code in backticks for Markdown formatting
      const extension = node.name.split(".").pop() || "";
      output += "```" + extension + "\n";

      // In a real scenario, we read the actual file content here
      // node.handle is the FileSystemFileHandle from the browser API
      const content = node.content || "// [Content could not be loaded]";
      output += content + "\n";

      output += "```\n\n";
    }

    if (node.children) {
      for (const child of node.children) {
        await traverse(child);
      }
    }
  }

  await traverse(root);
  return output;
}
