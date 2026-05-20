import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTION } from "@/lib/mongodb";

// These are the seed files — your current local changes are already in them
import siteJson from "@/data/site.json";
import rolesJson from "@/data/roles.json";
import competenciesJson from "@/data/competencies.json";
import evidenceJson from "@/data/evidence.json";

const SEEDS: Record<string, unknown> = {
  site: siteJson,
  roles: rolesJson,
  competencies: competenciesJson,
  evidence: evidenceJson,
};

const KEYS = ["site", "roles", "competencies", "evidence"] as const;

export async function GET() {
  try {
    const client = await clientPromise;
    const col = client.db(DB_NAME).collection(COLLECTION);

    const result: Record<string, unknown> = {};

    for (const key of KEYS) {
      const doc = await col.findOne({ type: key });
      if (!doc) {
        // First run — seed from local JSON (preserves your current changes)
        await col.insertOne({ type: key, data: SEEDS[key] });
        result[key] = SEEDS[key];
      } else {
        result[key] = doc.data;
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("MongoDB GET error:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
