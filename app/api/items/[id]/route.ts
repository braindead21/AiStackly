import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { ItemModel } from "@/models/Item";
import { getItem, updateItem, deleteItem, createItem } from "@/lib/data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await dbConnect();
    const item = await ItemModel.findById(id).lean();
    if (item) return NextResponse.json({ success: true, item });
    // If DB connected but item not found, check in-memory
    const memItem = getItem(id);
    if (memItem) return NextResponse.json({ success: true, item: memItem });
    console.error('[GET /api/items/:id] Item not found:', id);
    return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
  } catch (error) {
    console.error('[GET /api/items/:id] Database error:', error);
    // If DB connection fails, check in-memory
    const memItem = getItem(id);
    if (memItem) return NextResponse.json({ success: true, item: memItem });
    return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Robust body parsing similar to POST route
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
      console.error('[PUT /api/items/:id] Invalid request body');
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    // Input validation
    const name = typeof body["name"] === "string" ? (body["name"] as string).trim() : undefined;
    const description = typeof body["description"] === "string" ? (body["description"] as string).trim() : undefined;
    
    if (name !== undefined && (typeof name !== "string" || name.length === 0)) {
      console.error('[PUT /api/items/:id] Validation failed: invalid name');
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    // Try MongoDB update first
    try {
      await dbConnect();
      const updated = await ItemModel.findByIdAndUpdate(
        id,
        { name, description },
        { new: true, runValidators: true }
      ).lean();
      if (updated) {
        console.log('[PUT /api/items/:id] Item updated in DB:', id);
        return NextResponse.json({ success: true, item: updated });
      }
      // If DB connected but item not found there, try in-memory store
      const memExisting = getItem(id);
      if (!memExisting) {
        console.error('[PUT /api/items/:id] Item not found:', id);
        return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
      }
      const memUpdated = updateItem(id, { name, description });
      console.log('[PUT /api/items/:id] Item updated in memory:', id);
      return NextResponse.json({ success: true, item: memUpdated });
    } catch (dbError) {
      console.error('[PUT /api/items/:id] Database error, trying in-memory:', dbError);
      // Fallback to in-memory update when DB connection fails
      const existing = getItem(id);
      if (!existing) {
        return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
      }
      const updated = updateItem(id, { name, description });
      return NextResponse.json({ success: true, item: updated });
    }
  } catch (error) {
    console.error('[PUT /api/items/:id] Server error:', error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await dbConnect();
    const res = await ItemModel.findByIdAndDelete(id);
    if (res) {
      console.log('[DELETE /api/items/:id] Item deleted from DB:', id);
      return NextResponse.json({ success: true });
    }
    // If not in DB, try in-memory
    const ok = deleteItem(id);
    if (ok) {
      console.log('[DELETE /api/items/:id] Item deleted from memory:', id);
      return NextResponse.json({ success: true });
    }
    console.error('[DELETE /api/items/:id] Item not found:', id);
    return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
  } catch (error) {
    console.error('[DELETE /api/items/:id] Database error, trying in-memory:', error);
    const ok = deleteItem(id);
    if (ok) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
  }
}