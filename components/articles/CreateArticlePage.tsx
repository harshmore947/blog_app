"use client";

import React, { FormEvent, startTransition, useActionState } from "react";
import { useState } from "react";
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
import { createArticle } from "@/action/create-article";
import { Loader2 } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

function CreateArticlePage() {
  const [content, setContent] = useState("");
  const [formState, action, isPending] = useActionState(createArticle, {
    errors: {},
  });

  const handleSubmit = async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.append("content", content);

    startTransition(()=>{
      action(formData);
    })
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                type="text"
                name="title"
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
              <SelectCategory />
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
              {/* {formState.errors.featuredImage && (
                <span className="text-red-600 text-sm">
                  {formState.errors.featuredImage}
                </span>
              )} */}
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill theme="snow" value={content} onChange={setContent} />
              {formState.errors.content && (
                <span className="text-red-600 text-sm">{formState.errors.content}</span>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <Button disabled={isPending} type="submit" variant={"outline"}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>Publish Article</>
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

export default CreateArticlePage;

function SelectCategory() {
  return (
    <div>
      <Select name="category">
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
