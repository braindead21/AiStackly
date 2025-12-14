import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { ItemModel } from "@/models/Item";
import { createItem, listItems } from "@/lib/data";

export async function GET() {
  try {
    await dbConnect();
    const items = await ItemModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('[GET /api/items] Database error:', error);
    // Graceful fallback to in-memory list when DB is unavailable
    const items = listItems();
    return NextResponse.json({ success: true, items });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type")?.toLowerCase() || "";
    const raw = await req.text();

    const parseBody = (rawText: string, ct: string): Record<string, unknown> | null => {
      if (!rawText || !rawText.trim()) return null;
      const clean = rawText.replace(/^\uFEFF/, "").trim();

      const looksJson = ct.includes("application/json") || (/^[\[{]/.test(clean) && /[}\]]$/.test(clean));
      if (looksJson) {
        const normalized = clean.replace(/(^|[:,\[{\s])'(.*?)'(\s*[},\]\)]?)/g, (m) => m.replace(/'/g, '"'));
        try { return JSON.parse(normalized); } catch {}
      }

      if (ct.includes("application/x-www-form-urlencoded") || clean.includes("=")) {
        try {
          const params = new URLSearchParams(clean);
          return Object.fromEntries(params.entries());
        } catch {
          const [k, v] = clean.split("=");
          if (k && v !== undefined) return { [k]: v };
        }
      }

      try { return JSON.parse(clean); } catch { return null; }
    };

    const body = parseBody(raw, contentType);
    if (!body || typeof body !== "object") {
      console.error('[POST /api/items] Invalid request body');
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    // Input validation
    const name = typeof body["name"] === "string" ? (body["name"] as string).trim() : "";
    const description = typeof body["description"] === "string" ? (body["description"] as string).trim() : "";
    
    if (!name || typeof name !== "string") {
      console.error('[POST /api/items] Validation failed: name is required');
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    try {
      await dbConnect();
      const created = await ItemModel.create({ name, description });
      console.log('[POST /api/items] Item created:', created._id);
      return NextResponse.json({ success: true, item: created }, { status: 201 });
    } catch (dbError) {
      console.error('[POST /api/items] Database error, falling back to in-memory:', dbError);
      // Fallback: create in-memory item when DB connection fails
      const item = createItem({ name, description });
      return NextResponse.json({ success: true, item }, { status: 201 });
    }
  } catch (error) {
    console.error('[POST /api/items] Server error:', error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
