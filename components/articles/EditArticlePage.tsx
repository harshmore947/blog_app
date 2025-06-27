"use client";

import React, { FormEvent, startTransition, useActionState } from "react";
import { useState } from "react";
import Image from "next/image";
// import ReactQuill from "react-quill-new";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import "react-quill-new/dist/quill.snow.css";
import { Loader2 } from "lucide-react";
import { Article } from "@/app/generated/prisma";
import { editArticle } from "@/action/edit-article";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type EditArticleProps = {
  article: Article;
};

function EditArticlePage({ article }: EditArticleProps) {
  const [content, setContent] = useState(article.content);
  const [formState, action, isPending] = useActionState(
    editArticle.bind(null, article.id),
    {
      errors: {},
    }
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.append("content", content);

    startTransition(() => {
      action(formData);
    });
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                type="text"
                name="title"
                defaultValue={article.title}
                placeholder="Enter a article title"
              />
              {formState.errors.title && (
                <span className="text-red-600 text-sm">
                  {formState.errors.title}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <SelectCategory article={article} />
              {formState.errors.category && (
                <span className="text-red-600 text-sm">
                  {formState.errors.category}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              <Input
                name="featuredImage"
                accept="image/*"
                className="cursor-pointer"
                type="file"
              />
              {article.featureImage && (
                <div>
                  <Image
                    src={article.featureImage}
                    alt="featured-image"
                    width={1920}
                    height={1080}
                    className="w-48 h-32 objcet-cover rounded-md"
                  />
                </div>
              )}
              {/* {formState.errors.featuredImage && (
                <span className="text-red-600 text-sm">
                  {formState.errors.featuredImage}
                </span>
              )} */}
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill
                theme="snow"
                defaultValue={article.content}
                value={content}
                onChange={setContent}
              />
              {formState.errors.content && (
                <span className="text-red-600 text-sm">
                  {formState.errors.content}
                </span>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <Button disabled={isPending} type="submit" variant={"outline"}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>Edit Article</>
                )}
              </Button>
              <Button variant={"destructive"}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditArticlePage;

function SelectCategory({ article }: EditArticleProps) {
  return (
    <div>
      <Select name="category" defaultValue={article.category}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Technology">Technology</SelectItem>
          <SelectItem value="Programming">Programming</SelectItem>
          <SelectItem value="Web Devlopment">Web Devlopment</SelectItem>
          <SelectItem value="DSA">DSA</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
