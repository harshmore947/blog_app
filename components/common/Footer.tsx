import React from "react";
import { Button } from "../ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo & Description */}
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link href="/" className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Hoop
              </span>
            </Link>
            <p className="max-w-sm text-center text-sm text-muted-foreground md:text-left">
              Crafting digital experiences with passion and precision. Solo
              developer building meaningful solutions.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="mailto:your.email@example.com">
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hoop. Built with ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
