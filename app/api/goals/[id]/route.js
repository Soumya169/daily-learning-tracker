import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/lib/models/Goal";

function normalizeGoalBody(body, existingGoal) {
  const targetDays = Number(body.targetDays ?? existingGoal.targetDays);
  const completedDays = [...new Set((body.completedDays ?? existingGoal.completedDays ?? [])
    .map(Number)
    .filter((day) => Number.isInteger(day) && day >= 1 && day <= targetDays))]
    .sort((a, b) => a - b);

  const normalized = {
    ...body,
    targetDays,
    completedDays,
    status: completedDays.length >= targetDays ? "completed" : "active",
  };

  if (normalized.title) normalized.title = normalized.title.trim();
  if (normalized.description !== undefined) normalized.description = normalized.description.trim();
  if (normalized.category !== undefined) normalized.category = normalized.category.trim();
  if (!normalized.startDate) delete normalized.startDate;
  if (!normalized.endDate) normalized.endDate = undefined;

  return normalized;
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const currentGoal = await Goal.findById(id);
    if (!currentGoal) {
      return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
    }

    if (body.title !== undefined && !body.title?.trim()) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }
    if (body.targetDays !== undefined) {
      const targetDays = Number(body.targetDays);
      if (!Number.isInteger(targetDays) || targetDays < 1) {
        return NextResponse.json({ success: false, error: "Target days must be a positive number" }, { status: 400 });
      }
    }

    const normalized = normalizeGoalBody(body, currentGoal);
    const goal = await Goal.findByIdAndUpdate(id, normalized, { new: true, runValidators: true });
    if (!goal) {
      return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: goal });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const goal = await Goal.findByIdAndDelete(id);
    if (!goal) {
      return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: goal });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
