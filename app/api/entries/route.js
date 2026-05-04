import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Entry from "@/lib/models/Entry";
import Progress from "@/lib/models/Progress";

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
    const { day, topic, subtopic, notes, date, timeSpent, difficulty, mood, tags } = body;
    const normalizedDay = Number(day);

    if (!Number.isInteger(normalizedDay) || normalizedDay < 1 || !topic?.trim()) {
      return NextResponse.json({ success: false, error: "Day and Topic are required" }, { status: 400 });
    }

    const entry = await Entry.create({
      day: normalizedDay,
      topic: topic.trim(),
      subtopic: subtopic || "",
      notes: notes || "",
      date: date || new Date(),
      timeSpent: Math.max(Number(timeSpent) || 0, 0),
      difficulty: difficulty || "medium",
      mood: mood || "neutral",
      tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
    });

    const progress = await Progress.findOne();
    if (progress) {
      if (!progress.completedDays.includes(normalizedDay)) {
        progress.completedDays.push(normalizedDay);
        progress.completedDays.sort((a, b) => a - b);
        await progress.save();
      }
    } else {
      await Progress.create({ challengeType: 30, completedDays: [normalizedDay] });
    }

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
