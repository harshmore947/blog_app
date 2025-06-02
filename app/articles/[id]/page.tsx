"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Trash2, ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { likeArticle } from "@/action/like-article";
import {
  addComment,
  getComments,
  deleteComment,
} from "@/action/comment-article";
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

export default function ArticlePage() {
  const params = useParams();
  const { user } = useUser();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, []);

  useEffect(() => {
    if (user && article) {
      setIsLiked(article.likes.some((like) => like.authorId === user.id));
    }
  }, [article, user]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${params.id}`);
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      toast.error("Failed to fetch article");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const fetchedComments = await getComments(params.id as string);
      setComments(fetchedComments);
    } catch (error) {
      toast.error("Failed to load comments");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like articles");
      return;
    }
    try {
      const result = await likeArticle(params.id as string);
      setIsLiked(result);
      fetchArticle();
    } catch (error) {
      toast.error("Failed to like article");
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;

    try {
      await addComment(params.id as string, newComment);
      await fetchComments();
      setNewComment("");
      fetchArticle();
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await fetchComments();
      fetchArticle();
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen  flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Link href="/articles">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/articles">
          <Button variant="ghost" size="sm" className="mb-8 -ml-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Button>
        </Link>

        <article className="prose prose-gray dark:prose-invert max-w-none">
          {article.featureImage && (
            <img
              src={article.featureImage}
              alt={article.title}
              className="w-full aspect-video object-cover rounded-lg mb-8"
            />
          )}

          <header className="mb-8 not-prose">
            {article.category && (
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                {article.category}
              </span>
            )}
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={article.author.imageUrl} />
                <AvatarFallback>{article.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{article.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(article.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </header>

          <div className="whitespace-pre-wrap mb-8">{article.content}</div>

          <Separator className="my-8" />

          <div className="not-prose">
            <div className="flex items-center gap-4 mb-8">
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
                <span>{article.likes.length} likes</span>
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" strokeWidth={2} />
                <span>{article.comments.length} comments</span>
              </div>
            </div>

            <div id="comments" className="space-y-8">
              <h2 className="text-2xl font-semibold tracking-tight">
                Comments
              </h2>

              <div className="flex gap-4">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleAddComment}
                  size="sm"
                  className="self-start"
                >
                  Post
                </Button>
              </div>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.imageUrl} />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{comment.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    {user && comment.user.clerkUserId === user.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
