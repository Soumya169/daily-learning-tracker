import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    topic: { type: String, required: true, trim: true },
    subtopic: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Entry || mongoose.model("Entry", EntrySchema);
