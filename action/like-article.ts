"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";

export const likeArticle = async (articleId: string) => {
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

  const existingLike = await prisma.like.findFirst({
    where: {
      articleId,
      authorId: dbUser.id // Use our database user ID
    }
  });

  if (existingLike) {
    // Unlike if already liked
    await prisma.like.delete({
      where: {
        id: existingLike.id
      }
    });
    return false;
  } else {
    // Like if not liked
    await prisma.like.create({
      data: {
        articleId,
        authorId: dbUser.id // Use our database user ID
      }
    });
    return true;
  }
} 