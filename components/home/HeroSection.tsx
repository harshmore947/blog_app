import React from "react";
import { Button } from "../ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

function HeroSection() {
  return (
    <section className="relative isolate min-h-[85vh] overflow-hidden bg-gradient-to-br from-purple-600/20 via-indigo-950 to-black">
      {/* Gradient Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-1/3 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-600/30 to-indigo-600/30 blur-3xl" />
        <div className="absolute right-1/3 bottom-0 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 py-24 md:py-32">
        <div className="flex-1 space-y-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Explore the world through{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Words
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300/90 md:text-xl">
            Discover insightful articles, thought-provoking stories, and expert
            perspectives on technology
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="group relative min-w-[160px] overflow-hidden rounded-full bg-white px-8 py-3 text-base font-semibold text-indigo-950 transition-all hover:scale-105"
                >
                  <span className="relative z-10">Start Reading</span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 transform"></div>
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[160px] rounded-full border-gray-700 bg-transparent text-white hover:bg-white/10"
              >
                <span className="relative z-10 flex items-center gap-2 text-white">
                  Connect
                </span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Button>
            </SignedOut>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[160px] rounded-full border-gray-700 bg-transparent text-white hover:bg-white/10"
            >
              Explore Topics
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
