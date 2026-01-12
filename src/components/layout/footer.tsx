"use client";

import { Github, Linkedin, Globe} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border mt-20 pb-24 pt-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
            Developed by Pedro Pohlmann, for developers
          </p>
          <p className="text-xs text-muted-foreground">
            © {currentYear} RepoContext • Open Source Tool
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-muted/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border/50"
            title="GitHub Profile"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-muted/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border/50"
            title="LinkedIn Profile"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://your-portfolio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-muted/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all border border-border/50"
            title="Personal Portfolio"
          >
            <Globe size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
