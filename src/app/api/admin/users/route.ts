import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const client = await clientPromise;
    if (!client) {
      console.error("MongoDB client is undefined. Check your connection string and clientPromise implementation.");
      return NextResponse.json({ error: "MongoDB client is undefined." }, { status: 500 });
    }
    const db = client.db();

    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray();

    return NextResponse.json({ users });
  } catch (error: any) {
    // Log full error for debugging
    console.error("Database connection failed:", error?.message || error);
    return NextResponse.json({ error: "Database connection failed", details: error?.message || String(error) }, { status: 500 });
  }
}
