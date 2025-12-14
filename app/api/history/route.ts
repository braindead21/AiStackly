import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import SavedOutput from "@/models/SavedOutput";
import User from "@/models/User";

// GET /api/history - Get user's saved outputs
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
    const toolId = searchParams.get("toolId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    await connectDB();

    const query: any = { userId: session.user.id };
    if (toolId) {
      query.toolId = toolId;
    }

    const outputs = await SavedOutput.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await SavedOutput.countDocuments(query);

    return NextResponse.json({
      success: true,
      outputs,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    });
  } catch (error: any) {
    console.error("[GET /api/history] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

// POST /api/history - Save a new output
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { toolId, toolName, input, imageUrl, result, tokensUsed } = await req.json();

    if (!toolId || !toolName || !input || !result || !tokensUsed) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const savedOutput = await SavedOutput.create({
      userId: session.user.id,
      toolId,
      toolName,
      input,
      imageUrl: imageUrl || null,
      result,
      tokensUsed,
    });

    // Update user's saved outputs count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { savedOutputsCount: 1 },
    });

    return NextResponse.json({
      success: true,
      output: savedOutput,
    });
  } catch (error: any) {
    console.error("[POST /api/history] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save output" },
      { status: 500 }
    );
  }
}

// DELETE /api/history - Delete saved output
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
    const outputId = searchParams.get("id");

    if (!outputId) {
      return NextResponse.json(
        { success: false, error: "Output ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    const output = await SavedOutput.findOneAndDelete({
      _id: outputId,
      userId: session.user.id,
    });

    if (!output) {
      return NextResponse.json(
        { success: false, error: "Output not found" },
        { status: 404 }
      );
    }

    // Update user's saved outputs count
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { savedOutputsCount: -1 },
    });

    return NextResponse.json({
      success: true,
      message: "Output deleted",
    });
  } catch (error: any) {
    console.error("[DELETE /api/history] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete output" },
      { status: 500 }
    );
  }
}
