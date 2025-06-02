import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { FileText, PlusCircle, Eye, MessageSquare, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RecentArticles from "./RecentArticles";
import { prisma } from "@/lib/prisma";

async function Blogdashboard() {
  const [articles,totalComments] = await Promise.all([
    prisma.article.findMany({
      orderBy:{
        createdAt:"desc"
      },
      include:{
        comments:true,
        author:{
          select:{
            name:true,
            email:true,
            imageUrl:true
          }
        }
      }
    }),
    prisma.comment.count(),
  ])
  return (
    <main className="flex flex-col p-4 gap-y-3 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-2xl">Blog Dashboard</h1>
          <p>Manage your Content and Analytics</p>
        </div>
        <Link href={"/dashboard/articles/create"}>
          <Button variant={"outline"}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>
      {/* Quick Stats */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              Total Articles
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2K</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-sm">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5</div>
            <p className="text-xs text-muted-foreground">
              +0.2 from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <RecentArticles articles={articles}/>
      </div>
    </main>
  );
}

export default Blogdashboard;
