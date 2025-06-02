"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";

export const articles = async () => {
  const user = await auth();
  if (!user || !user.userId) {
    return "please login";
  }

  const articles = await prisma.article.findMany({
    include: {
      likes: true,
      comments: true,
      author: true
    }
  });
  return articles;
}