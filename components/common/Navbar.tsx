import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ModeToggle } from "../ui/modeToggle";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Left Section */}
          <div className="w-1/4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to bg-indigo-600 dark:from-purple-400 dark:to-bg-indigo-400 bg-clip-text text-transparent ">
                Hoop
              </span>
            </Link>
          </div>

          {/* middle Section */}
          <div className="hidden md:flex items-center justify-center w-1/2">
            <Link href="/articles">
              <Button variant="ghost">Articles</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>

          {/* right section */}
          {/* user action */}
          <div className="hidden md:flex items-center justify-end gap-2 w-1/4">
            <Input placeholder="Search" />
            <ModeToggle />

            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 hover:shadow-[0_0_20px_rgba(129,140,248,0.3)] transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    Connect
                    <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
