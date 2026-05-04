import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/lib/models/Goal";

export const dynamic = "force-dynamic";

function normalizeGoalBody(body, existingGoal) {
  const targetDays = Number(body.targetDays ?? existingGoal?.targetDays);
  const completedDays = [...new Set((body.completedDays ?? existingGoal?.completedDays ?? [])
    .map(Number)
    .filter((day) => Number.isInteger(day) && day >= 1 && day <= targetDays))]
    .sort((a, b) => a - b);

  const normalized = {
    ...body,
    title: body.title?.trim(),
    description: body.description?.trim() || "",
    category: body.category?.trim() || "",
    targetDays,
    completedDays,
    status: completedDays.length >= targetDays ? "completed" : "active",
  };

  if (!normalized.startDate) delete normalized.startDate;
  if (!normalized.endDate) delete normalized.endDate;

  return normalized;
}

export async function GET() {
  try {
    await connectDB();
    const goals = await Goal.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: goals });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const targetDays = Number(body.targetDays);
    if (!body.title?.trim() || !Number.isInteger(targetDays) || targetDays < 1) {
      return NextResponse.json({ success: false, error: "Title and valid target days are required" }, { status: 400 });
    }

    const goal = new Goal(normalizeGoalBody({ ...body, completedDays: [] }));
    await goal.save();
    return NextResponse.json({ success: true, data: goal }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
