import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const onboardSchema = z.object({
  role: z.enum(["CANDIDATE", "COMPANY"]),
  category: z.string().min(1, "Category is required"),
  country: z.string().min(1, "Country is required"),
  experienceLevel: z.enum(["Entry", "Mid", "Senior", "Expert"]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = onboardSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: (result.error as any).errors[0].message },
        { status: 400 }
      );
    }

    const { role, category, country, experienceLevel } = result.data;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        role,
        category,
        country,
        experienceLevel,
        isOnboarded: true,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      role: updatedUser.role,
      isOnboarded: updatedUser.isOnboarded,
      isVerified: updatedUser.isVerified,
    });
  } catch (error) {
    console.error("[Onboard] Error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding." },
      { status: 500 }
    );
  }
}
