import mongoose, { Schema } from 'mongoose';
import { IVisit } from '../types/index.js';

const visitSchema = new Schema<IVisit>({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gym: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  checkOutTime: {
    type: Date,
  },
  tokensUsed: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Compound index for efficient queries
visitSchema.index({ member: 1, date: -1 });
visitSchema.index({ gym: 1, date: -1 });
visitSchema.index({ date: -1 });

// Index to prevent duplicate visits on same day to same gym
visitSchema.index(
  { member: 1, gym: 1, date: 1 },
  { 
    unique: true,
    partialFilterExpression: { 
      date: { $type: "date" } 
    }
  }
);

export const Visit = mongoose.model<IVisit>('Visit', visitSchema); 