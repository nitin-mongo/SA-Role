import { NextRequest, NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTION } from "@/lib/mongodb";

const ALLOWED = ["site", "roles", "competencies", "evidence"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file, data } = body;

    if (!ALLOWED.includes(file)) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    const client = await clientPromise;
    const col = client.db(DB_NAME).collection(COLLECTION);

    await col.updateOne(
      { type: file },
      { $set: { data, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("MongoDB save error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
