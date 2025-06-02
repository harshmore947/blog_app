import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await currentUser();

    if (user) {
      const loggedInUser = await prisma.user.findUnique({
        where: {
          clerkUserId: user.id,
        },
      });

      if (!loggedInUser) {
        await prisma.user.create({
          data: {
            name: user.fullName ?? "",
            clerkUserId: user.id,
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl,
          },
        });
      }
    }

    return <div className="w-full">{children}</div>;
  } catch (error) {
    console.error("Error in home layout:", error);
    // Still render the children even if there's an error
    return <div className="w-full">{children}</div>;
  }
}
