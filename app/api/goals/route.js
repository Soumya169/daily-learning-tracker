import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/lib/models/Goal";

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
    const goal = new Goal(body);
    await goal.save();
    return NextResponse.json({ success: true, data: goal }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}