import { FileNode } from "@/store/use-repo-store";

export async function generateMarkdown(
  root: FileNode,
  selectedPaths: Set<string>
): Promise<string> {
  let output = "# Project Context\n\n";
  output += `Generated on: ${new Date().toLocaleString()}\n\n`;

  async function traverse(node: FileNode) {
    if (node.kind === "file" && selectedPaths.has(node.path)) {
      output += `## File: ${node.path}\n`;
      output += "---\n";

      const extension = node.name.split(".").pop() || "";
      output += "```" + extension + "\n";

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
