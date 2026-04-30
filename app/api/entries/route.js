import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Entry from "@/lib/models/Entry";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const search = searchParams.get("search");

    let query = {};
    if (topic) query.topic = topic;
    if (search) {
      query.$or = [
        { topic: { $regex: search, $options: "i" } },
        { subtopic: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    const entries = await Entry.find(query).sort({ day: 1 });
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { day, topic, subtopic, notes, date } = body;

    if (!day || !topic) {
      return NextResponse.json({ success: false, error: "Day and Topic are required" }, { status: 400 });
    }

    const entry = await Entry.create({ day, topic, subtopic, notes, date: date || new Date() });
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
