import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Entry from "@/lib/models/Entry";
import Progress from "@/lib/models/Progress";

export const dynamic = "force-dynamic";

function normalizeProgress(progress) {
  const challengeType = [30, 45].includes(Number(progress.challengeType))
    ? Number(progress.challengeType)
    : 30;
  const completedDays = [...new Set((progress.completedDays || [])
    .map(Number)
    .filter((day) => Number.isInteger(day) && day >= 1 && day <= challengeType))]
    .sort((a, b) => a - b);

  return { challengeType, completedDays };
}

export async function GET() {
  try {
    await connectDB();
    let progress = await Progress.findOne();
    if (!progress) {
      progress = await Progress.create({ challengeType: 30, completedDays: [] });
    }
    const entryDays = await Entry.distinct("day");
    const normalized = normalizeProgress({
      challengeType: progress.challengeType,
      completedDays: [...(progress.completedDays || []), ...entryDays],
    });

    const shouldSave =
      progress.challengeType !== normalized.challengeType ||
      JSON.stringify([...(progress.completedDays || [])].sort((a, b) => a - b)) !==
        JSON.stringify(normalized.completedDays);

    if (shouldSave) {
      progress.challengeType = normalized.challengeType;
      progress.completedDays = normalized.completedDays;
      await progress.save();
    }

    const data = {
      ...progress.toObject(),
      completedDays: normalized.completedDays,
      challengeType: normalized.challengeType,
    };
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const normalized = normalizeProgress(body);
    let progress = await Progress.findOne();
    if (!progress) {
      progress = await Progress.create(normalized);
    } else {
      progress = await Progress.findByIdAndUpdate(progress._id, normalized, { new: true, runValidators: true });
    }
    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
