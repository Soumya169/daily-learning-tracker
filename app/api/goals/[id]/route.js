import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/lib/models/Goal";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await request.json();
    const goal = await Goal.findByIdAndUpdate(id, body, { new: true });
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