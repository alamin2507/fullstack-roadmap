import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  checked: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  theme: {
    type: String,
    default: 'dark',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
