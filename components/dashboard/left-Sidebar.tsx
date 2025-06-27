"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import {
  BarChart,
  File,
  LayoutDashboard,
  LayoutDashboardIcon,
  Settings,
  TrendingUp,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Sample data - replace with actual data from your backend
const topArticles = [
  { title: "Getting Started with Next.js", views: 1200 },
  { title: "Understanding TypeScript", views: 980 },
  { title: "React Best Practices", views: 850 },
  { title: "Modern Web Development", views: 750 },
  { title: "CSS Grid Tutorial", views: 600 },
];

function LeftSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden m-4">
            <LayoutDashboard className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px]">
          <DashboardSideBar />
        </SheetContent>
      </Sheet>
      <div className="hidden md:block h-screen w-[250px] border-r bg-background">
        <DashboardSideBar />
      </div>
    </div>
  );
}

export default LeftSidebar;

const DashboardSideBar = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-6">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Link href={"/dashboard"}>
            <span className="text-sm font-bold">Home</span>
          </Link>
        </div>
        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button className="w-full justify-start" variant="ghost">
              <LayoutDashboardIcon className="w-5 h-5 mr-2" />
              Overview
            </Button>
          </Link>
          <Link href="/dashboard/articles/create">
            <Button className="w-full justify-start" variant="ghost">
              <File className="w-5 h-5 mr-2" />
              Article
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full justify-start" variant="ghost">
              <BarChart className="w-5 h-5 mr-2" />
              Analytics
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full justify-start" variant="ghost">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>

      <Separator className="my-4" />

      {/* Top Articles by Views Section */}
      <div className="px-4 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Top Articles by Views</h2>
        </div>
        <ScrollArea className="h-[250px] ">
          <div className="space-y-4">
            {topArticles.map((article, index) => (
              <Link href={`/articles/${index}`} key={index}>
                <div className="group rounded-md -mx-2 p-2 hover:bg-muted/50 transition-colors">
                  <div className="text-xs font-medium truncate mb-1">
                    {article.title}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    {article.views.toLocaleString()} views
                  </div>
                  <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${
                          (article.views / topArticles[0].views) * 100
                        }%`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
