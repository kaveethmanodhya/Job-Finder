import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// 1. GET ALL USERS (CANDIDATES & COMPANIES)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: { in: ["CANDIDATE", "COMPANY"] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        category: true,
        createdAt: true,
        // Include related counts if it's a company
        company: {
          select: {
            _count: {
              select: { jobs: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("[Admin Users GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// 2. TOGGLE VERIFICATION STATUS
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { userId, isVerified } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("[Admin Users PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
  }
}

// 3. BULK OR SINGLE DELETE
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { userIds } = body; // Array of IDs

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "No user IDs provided" }, { status: 400 });
    }

    // Protection: Ensure admin doesn't delete themselves (though UI should prevent it)
    const adminId = (session.user as any).id;
    const safeUserIds = userIds.filter((id) => id !== adminId);

    const deleted = await prisma.user.deleteMany({
      where: {
        id: { in: safeUserIds },
      },
    });

    return NextResponse.json({ success: true, count: deleted.count });
  } catch (error: any) {
    console.error("[Admin Users DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete users" }, { status: 500 });
  }
}
