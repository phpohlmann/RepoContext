import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoContext | AI-Ready Codebase Packaging",
  description:
    "Transform your local repository into a clean, token-optimized Markdown context for LLMs like GPT-4 and Claude.",
  keywords: ["AI", "LLM", "Developer Tools", "GPT-4", "Context", "Coding"],
  authors: [{ name: "Pedro Pohlmann" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
