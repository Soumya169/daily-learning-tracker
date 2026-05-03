import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Entry from "@/lib/models/Entry";
import Progress from "@/lib/models/Progress";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    const entry = await Entry.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!entry) return NextResponse.json({ success: false, error: "Entry not found" }, { status: 404 });
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
