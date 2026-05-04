import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Entry from "@/lib/models/Entry";
import Progress from "@/lib/models/Progress";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    if (body.day !== undefined) {
      const normalizedDay = Number(body.day);
      if (!Number.isInteger(normalizedDay) || normalizedDay < 1) {
        return NextResponse.json({ success: false, error: "Day must be a positive number" }, { status: 400 });
      }
      body.day = normalizedDay;
    }
    if (body.topic !== undefined && !body.topic?.trim()) {
      return NextResponse.json({ success: false, error: "Topic is required" }, { status: 400 });
    }
    if (body.topic) body.topic = body.topic.trim();
    if (body.timeSpent !== undefined) body.timeSpent = Math.max(Number(body.timeSpent) || 0, 0);
    if (body.tags !== undefined) body.tags = Array.isArray(body.tags) ? body.tags.filter(Boolean) : [];

    const previousEntry = await Entry.findById(params.id);
    const entry = await Entry.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!entry) return NextResponse.json({ success: false, error: "Entry not found" }, { status: 404 });

    const progress = await Progress.findOne();
    if (progress) {
      if (!progress.completedDays.includes(entry.day)) {
        progress.completedDays.push(entry.day);
      }
      if (previousEntry && previousEntry.day !== entry.day) {
        const stillHasOldDay = await Entry.exists({ day: previousEntry.day });
        if (!stillHasOldDay) {
          progress.completedDays = progress.completedDays.filter((day) => day !== previousEntry.day);
        }
      }
      progress.completedDays = [...new Set(progress.completedDays)].sort((a, b) => a - b);
      await progress.save();
    }

    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const entry = await Entry.findByIdAndDelete(params.id);
    if (!entry) return NextResponse.json({ success: false, error: "Entry not found" }, { status: 404 });

    const progress = await Progress.findOne();
    if (progress) {
      const stillHasDay = await Entry.exists({ day: entry.day });
      if (!stillHasDay && progress.completedDays.includes(entry.day)) {
        progress.completedDays = progress.completedDays.filter((d) => d !== entry.day);
        await progress.save();
      }
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
