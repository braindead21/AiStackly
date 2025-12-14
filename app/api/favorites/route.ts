import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import FavoriteTool from "@/models/FavoriteTool";
import User from "@/models/User";

// GET /api/favorites - Get user's favorite tools
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const favorites = await FavoriteTool.find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      favorites,
    });
  } catch (error: any) {
    console.error("[GET /api/favorites] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add tool to favorites
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { toolId, toolName } = await req.json();

    if (!toolId || !toolName) {
      return NextResponse.json(
        { success: false, error: "Tool ID and name are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if already favorited
    const existing = await FavoriteTool.findOne({
      userId: session.user.id,
      toolId,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Tool already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await FavoriteTool.create({
      userId: session.user.id,
      toolId,
      toolName,
    });

    // Update user's favorite tools count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { favoriteToolsCount: 1 },
    });

    return NextResponse.json({
      success: true,
      favorite,
    });
  } catch (error: any) {
    console.error("[POST /api/favorites] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Remove tool from favorites
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const toolId = searchParams.get("toolId");

    if (!toolId) {
      return NextResponse.json(
        { success: false, error: "Tool ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    const favorite = await FavoriteTool.findOneAndDelete({
      userId: session.user.id,
      toolId,
    });

    if (!favorite) {
      return NextResponse.json(
        { success: false, error: "Favorite not found" },
        { status: 404 }
      );
    }

    // Update user's favorite tools count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { favoriteToolsCount: -1 },
    });

    return NextResponse.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error: any) {
    console.error("[DELETE /api/favorites] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
