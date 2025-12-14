import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import UserAnalytics from "@/models/UserAnalytics";
import User from "@/models/User";

// GET /api/analytics - Get user's analytics
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");

    await connectDB();

    // Get analytics for the last N days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await UserAnalytics.find({
      userId: session.user.id,
      date: { $gte: startDate },
    })
      .sort({ date: -1 })
      .lean();

    // Get user data for streak
    const user = await User.findById(session.user.id).select('dailyStreak lastStreakDate totalTokensUsed savedOutputsCount').lean();

    // Calculate total usage
    const totalRequests = analytics.reduce((sum, day) => sum + day.totalRequests, 0);
    const totalTokens = analytics.reduce((sum, day) => sum + day.totalTokens, 0);

    // Get most used tools
    const toolUsageMap = new Map<string, { toolId: string; toolName: string; count: number }>();
    
    analytics.forEach(day => {
      day.toolsUsed.forEach(tool => {
        const existing = toolUsageMap.get(tool.toolId);
        if (existing) {
          existing.count += tool.count;
        } else {
          toolUsageMap.set(tool.toolId, {
            toolId: tool.toolId,
            toolName: tool.toolName,
            count: tool.count,
          });
        }
      });
    });

    const mostUsedTools = Array.from(toolUsageMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      analytics: analytics,
      totalRequests,
      totalTokens,
      mostUsedTools,
      dailyStreak: user?.dailyStreak || 0,
      totalTokensUsed: user?.totalTokensUsed || 0,
    });
  } catch (error: any) {
    console.error("[GET /api/analytics] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// POST /api/analytics - Track tool usage
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { toolId, toolName, tokensUsed } = await req.json();

    if (!toolId || !toolName || typeof tokensUsed !== 'number') {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's analytics
    let dayAnalytics = await UserAnalytics.findOne({
      userId: session.user.id,
      date: today,
    });

    if (!dayAnalytics) {
      dayAnalytics = await UserAnalytics.create({
        userId: session.user.id,
        date: today,
        toolsUsed: [],
        totalRequests: 0,
        totalTokens: 0,
      });
    }

    // Update tool usage
    const toolIndex = dayAnalytics.toolsUsed.findIndex(t => t.toolId === toolId);
    
    if (toolIndex >= 0) {
      dayAnalytics.toolsUsed[toolIndex].count += 1;
      dayAnalytics.toolsUsed[toolIndex].lastUsed = new Date();
    } else {
      dayAnalytics.toolsUsed.push({
        toolId,
        toolName,
        count: 1,
        lastUsed: new Date(),
      });
    }

    dayAnalytics.totalRequests += 1;
    dayAnalytics.totalTokens += tokensUsed;

    await dayAnalytics.save();

    // Update user's total tokens and streak
    const user = await User.findById(session.user.id);
    if (user) {
      user.totalTokensUsed = (user.totalTokensUsed || 0) + tokensUsed;

      // Update streak
      const lastStreak = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (!lastStreak) {
        user.dailyStreak = 1;
        user.lastStreakDate = today;
      } else {
        lastStreak.setHours(0, 0, 0, 0);
        if (lastStreak.getTime() === yesterday.getTime()) {
          user.dailyStreak += 1;
          user.lastStreakDate = today;
        } else if (lastStreak.getTime() !== today.getTime()) {
          user.dailyStreak = 1;
          user.lastStreakDate = today;
        }
      }

      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Analytics updated",
    });
  } catch (error: any) {
    console.error("[POST /api/analytics] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update analytics" },
      { status: 500 }
    );
  }
}
