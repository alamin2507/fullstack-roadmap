import mongoose, { Schema, Document } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  completedTasks: string[]; // Stores tasks in format: "milestoneId-moduleIndex" (e.g. "0-3")
  updatedAt: Date;
}

const ProgressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  completedTasks: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

export const Progress = mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);
