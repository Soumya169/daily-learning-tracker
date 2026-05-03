import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    targetDays: { type: Number, required: true },
    completedDays: { type: [Number], default: [] },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "completed", "paused"], default: "active" },
    category: { type: String, trim: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  },
  { timestamps: true }
);

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);