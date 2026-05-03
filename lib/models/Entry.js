import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    topic: { type: String, required: true, trim: true },
    subtopic: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    timeSpent: { type: Number, default: 0 }, // Time spent in minutes
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    mood: { type: String, enum: ["frustrated", "neutral", "satisfied", "excited"], default: "neutral" },
    tags: [{ type: String, trim: true }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Entry || mongoose.model("Entry", EntrySchema);
