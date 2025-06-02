"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";

export const addComment = async (articleId: string, content: string) => {
  const user = await auth();
  if (!user || !user.userId) {
    throw new Error("Unauthorized");
  }

  // Get the user from our database using Clerk ID
  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.userId
    }
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      articleId,
      authorId: dbUser.id
    },
    include: {
      user: true
    }
  });

  return comment;
}

export const getComments = async (articleId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      articleId
    },
    include: {
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return comments;
}

export const deleteComment = async (commentId: string) => {
  const user = await auth();
  if (!user || !user.userId) {
    throw new Error("Unauthorized");
  }

  // Get the user from our database using Clerk ID
  const dbUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.userId
    }
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId
    }
  });

  if (!comment || comment.authorId !== dbUser.id) {
    throw new Error("Unauthorized to delete this comment");
  }

  await prisma.comment.delete({
    where: {
      id: commentId
    }
  });

  return true;
} 