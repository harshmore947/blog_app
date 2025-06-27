"use client";

import React, { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Loader2, MoveRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { deleteArticle } from "@/action/delete-article";

type RecentArticlesProps = {
  articles: Prisma.ArticleGetPayload<{
    include: {
      comments: true;
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>[];
};

function RecentArticles({ articles }: RecentArticlesProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Articles</CardTitle>
          <Button
            className="text-muted-foreground"
            size={"sm"}
            variant={"ghost"}
          >
            View All <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      {!articles.length ? (
        <CardContent>No Article Found</CardContent>
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={"outline"}
                      className="rounded-full bg-green-100 text-green-800"
                    >
                      Published
                    </Badge>
                  </TableCell>
                  <TableCell>{article.comments.length}</TableCell>
                  <TableCell>{article.createdAt.toDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-x-2">
                      <Link href={`/dashboard/articles/${article.id}/edit`}>
                        <Button variant={"outline"} size={"sm"}>
                          Edit
                        </Button>
                      </Link>
                      <DeleteButton articleId={article.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}

export default RecentArticles;

type DeleteButtonProps = {
  articleId: string;
};

const DeleteButton = ({ articleId }: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={() => {
        startTransition(async () => await deleteArticle(articleId));
      }}
    >
      <Button
        disabled={isPending}
        variant={"destructive"}
        size={"sm"}
        type="submit"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
          </>
        ) : (
          <>Delete</>
        )}
      </Button>
    </form>
  );
};
