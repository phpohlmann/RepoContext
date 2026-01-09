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

      // Use the content from the node (which should now be populated)
      if (node.content) {
        output += node.content + "\n";
      } else {
        output += "// [Content empty or not yet loaded]\n";
      }

      output += "```\n\n";
    }

    if (node.children) {
      // Parallel traversal for speed
      await Promise.all(node.children.map((child) => traverse(child)));
    }
  }

  await traverse(root);
  return output;
}
