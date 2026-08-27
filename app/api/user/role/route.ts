import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const roleSchema = z.object({
  role: z.enum(["CANDIDATE", "COMPANY"]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = roleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid role. Must be CANDIDATE or COMPANY" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { role: result.data.role },
    });

    return NextResponse.json({
      success: true,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
