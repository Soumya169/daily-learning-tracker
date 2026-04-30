import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    challengeType: { type: Number, default: 30, enum: [30, 45] },
    completedDays: { type: [Number], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
