import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id, name, email, imageUrl } = await request.json();

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkUserId: id,
      },
    });

    if (!existingUser) {
      // Create new user
      await prisma.user.create({
        data: {
          name: name || '',
          clerkUserId: id,
          email: email,
          imageUrl: imageUrl || '',
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
