import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "emails.json");

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Read existing emails
    let emails: Array<{ email: string; timestamp: string }> = [];
    try {
      const content = await readFile(DATA_FILE, "utf-8");
      emails = JSON.parse(content);
    } catch {
      // File doesn't exist yet
    }

    // Check for duplicate
    if (!emails.find((e) => e.email === email)) {
      emails.push({ email, timestamp: new Date().toISOString() });
      await writeFile(DATA_FILE, JSON.stringify(emails, null, 2));
    }

    return NextResponse.json({ success: true, message: "Email captured" });
  } catch (error) {
    console.error("Email capture error:", error);
    return NextResponse.json({ error: "Failed to capture email" }, { status: 500 });
  }
}
