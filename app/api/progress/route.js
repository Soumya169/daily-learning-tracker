import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Progress from "@/lib/models/Progress";

export async function GET() {
  try {
    await connectDB();
    let progress = await Progress.findOne();
    if (!progress) {
      progress = await Progress.create({ challengeType: 30, completedDays: [] });
    }
    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    let progress = await Progress.findOne();
    if (!progress) {
      progress = await Progress.create(body);
    } else {
      progress = await Progress.findByIdAndUpdate(progress._id, body, { new: true, runValidators: true });
    }
    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
