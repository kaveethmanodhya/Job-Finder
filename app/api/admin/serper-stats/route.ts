import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // 1. Security: Verify User Session & Admin Role
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    // 2. Fetch Serper Stats
    const serperKey = process.env.SERPER_API_KEY;
    
    if (!serperKey) {
      return NextResponse.json(
        { error: "SERPER_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const response = await fetch("https://google.serper.dev/account", {
      method: "GET",
      headers: {
        "X-API-KEY": serperKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Serper API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Serper returns { "balance": 2492, "rateLimit": 5 }
    // Free tier max is 2500. Usage is 2500 - balance.
    const maxCredits = 2500;
    const remaining = data.balance || 0;
    const usage = maxCredits - remaining;

    return NextResponse.json({
      thisMonthUsage: usage,
      thisMonthLimit: maxCredits
    });
    
  } catch (error: any) {
    // 4. Graceful Error Handling
    console.error("[Serper Stats API Error]:", error.message || error);
    return NextResponse.json(
      { error: "Failed to fetch Serper account statistics. Please try again later." },
      { status: 500 }
    );
  }
}
