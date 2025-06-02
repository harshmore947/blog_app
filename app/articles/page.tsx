"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { articles as fetchArticlesAction } from "@/action/fetch-articles";
import { likeArticle } from "@/action/like-article";
import {
  addComment,
  getComments,
  deleteComment,
} from "@/action/comment-article";
import { Heart, MessageCircle, Trash2, Filter } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  featureImage: string;
  authorId: string;
  createdAt: Date;
  likes: any[];
  comments: any[];
  author: {
    name: string;
    imageUrl: string;
  };
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await fetchArticlesAction();
      if (typeof data === "string") {
        toast.error(data);
        return;
      }
      setArticles(data as any);
    } catch (error) {
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return b.likes.length - a.likes.length;
    }
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
              <p className="mt-2 text-muted-foreground">
                Discover interesting stories and ideas
              </p>
            </div>
            <SortBy value={sortBy} onChange={setSortBy} />
          </div>

          <Separator />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 w-3/4 bg-muted rounded" />
                      <div className="h-4 w-1/4 bg-muted rounded" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-5/6 bg-muted rounded" />
                      <div className="h-4 w-4/6 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onUpdate={fetchArticles}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  onUpdate,
}: {
  article: Article;
  onUpdate: () => void;
}) {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLiked(article.likes.some((like) => like.authorId === user.id));
    }
  }, [article.likes, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like articles");
      return;
    }
    try {
      const result = await likeArticle(article.id);
      setIsLiked(result);
      onUpdate();
    } catch (error) {
      toast.error("Failed to like article");
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const fetchedComments = await getComments(article.id);
        setComments(fetchedComments);
      } catch (error) {
        toast.error("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;

    try {
      await addComment(article.id, newComment);
      const updatedComments = await getComments(article.id);
      setComments(updatedComments);
      setNewComment("");
      onUpdate();
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      const updatedComments = await getComments(article.id);
      setComments(updatedComments);
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/articles/${article.id}`}>
        <div>
          {article.featureImage && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.featureImage}
                alt={article.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              {article.category && (
                <span className="absolute top-4 left-4 bg-black/75 text-white px-3 py-1 rounded-full text-xs">
                  {article.category}
                </span>
              )}
            </div>
          )}
          <CardHeader className="cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={article.author.imageUrl} />
                <AvatarFallback>{article.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {article.author.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(article.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
              {article.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              {article.content}
            </CardDescription>
          </CardHeader>
        </div>
      </Link>
      <CardFooter className="border-t bg-muted/50 p-4">
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
              strokeWidth={2}
            />
            <span className="text-sm">{article.likes.length}</span>
          </Button>
          <Link href={`/articles/${article.id}#comments`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" strokeWidth={2} />
              <span className="text-sm">{article.comments.length}</span>
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function SortBy({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Sort by
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Sort articles by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value="latest" className="gap-2">
            Latest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest" className="gap-2">
            Oldest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="popular" className="gap-2">
            Most liked
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
