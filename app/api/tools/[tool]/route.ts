import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { groq } from "@/lib/groq";
import { getToolConfig } from "@/config/tools";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/lib/db";
import SavedOutput from "@/models/SavedOutput";
import User from "@/models/User";
import UserAnalytics from "@/models/UserAnalytics";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tool: string }> }
) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('[POST /api/tools/:tool] Missing GROQ_API_KEY');
      return NextResponse.json({ 
        success: false, 
        error: "AI service not configured. Please set GROQ_API_KEY." 
      }, { status: 500 });
    }

    const { tool } = await params;
    const config = getToolConfig(tool);

    if (!config) {
      console.error('[POST /api/tools/:tool] Invalid tool:', tool);
      return NextResponse.json({ 
        success: false, 
        error: "Invalid tool ID" 
      }, { status: 404 });
    }

    const body = await req.json();
    const { input, imageUrl, fileName, fileType } = body;

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      console.error('[POST /api/tools/:tool] Missing or invalid input');
      return NextResponse.json({ 
        success: false, 
        error: "Input is required" 
      }, { status: 400 });
    }

    console.log(`[POST /api/tools/:tool] Processing ${tool} with input length:`, input.length);
    if (fileName) {
      console.log(`[POST /api/tools/:tool] File uploaded: ${fileName} (${fileType || 'image'})`);
    }

    // Build message content - support for vision models if image URL provided
    let modelToUse = "llama-3.1-8b-instant";
    const messageContent = imageUrl 
      ? [
          { type: "text" as const, text: config.prompt + input },
          { type: "image_url" as const, image_url: { url: imageUrl } }
        ]
      : config.prompt + input;

    // Use vision model for images
    if (imageUrl) {
      modelToUse = "meta-llama/llama-4-scout-17b-16e-instruct";
    }

    const response = await groq.chat.completions.create({
      model: modelToUse,
      messages: [
        {
          role: "user",
          content: messageContent
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const result = response.choices[0].message.content;
    const usage = response.usage;

    console.log(`[POST /api/tools/:tool] Success. Tokens used:`, usage?.total_tokens);

    // Auto-save for logged-in users
    const session = await getServerSession(authOptions);
    if (session?.user?.id && usage) {
      try {
        await dbConnect();
        
        // Save output to history
        const savedOutput = await SavedOutput.create({
          userId: session.user.id,
          toolId: tool,
          toolName: config.title,
          input: input.trim(),
          imageUrl: imageUrl || undefined,
          fileName: fileName || undefined,
          result: result || "",
          tokensUsed: {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens,
          }
        });

        // Update user stats
        await User.findByIdAndUpdate(session.user.id, {
          $inc: { 
            savedOutputsCount: 1,
            totalTokensUsed: usage.total_tokens 
          }
        });

        // Track in analytics
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const analytics = await UserAnalytics.findOne({
          userId: session.user.id,
          date: today,
        });

        if (analytics) {
          // Update existing analytics
          const toolIndex = analytics.toolsUsed.findIndex(t => t.toolId === tool);
          if (toolIndex >= 0) {
            analytics.toolsUsed[toolIndex].count += 1;
            analytics.toolsUsed[toolIndex].lastUsed = new Date();
          } else {
            analytics.toolsUsed.push({
              toolId: tool,
              toolName: config.title,
              count: 1,
              lastUsed: new Date(),
            });
          }
          analytics.totalRequests += 1;
          analytics.totalTokens += usage.total_tokens;
          await analytics.save();
        } else {
          // Create new analytics entry
          await UserAnalytics.create({
            userId: session.user.id,
            date: today,
            toolsUsed: [{
              toolId: tool,
              toolName: config.title,
              count: 1,
              lastUsed: new Date(),
            }],
            totalRequests: 1,
            totalTokens: usage.total_tokens,
          });
        }

        // Update daily streak
        const user = await User.findById(session.user.id);
        if (user) {
          const lastStreak = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          if (!lastStreak || lastStreak < yesterday) {
            // Reset streak
            user.dailyStreak = 1;
            user.lastStreakDate = today;
          } else if (lastStreak.getTime() === yesterday.getTime()) {
            // Increment streak
            user.dailyStreak += 1;
            user.lastStreakDate = today;
          }
          // If lastStreak === today, don't change anything
          await user.save();
        }

        console.log(`[POST /api/tools/:tool] Saved output ${savedOutput._id} for user ${session.user.id}`);
      } catch (saveError) {
        console.error('[POST /api/tools/:tool] Failed to save output:', saveError);
        // Continue anyway - don't fail the request if saving fails
      }
    }

    return NextResponse.json({ 
      success: true,
      output: result,
      result,
      usage: usage ? {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      } : undefined
    });

  } catch (error: any) {
    console.error('[POST /api/tools/:tool] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || "Failed to process request" 
    }, { status: 500 });
  }
}
