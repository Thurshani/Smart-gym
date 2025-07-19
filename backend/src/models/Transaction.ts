import mongoose, { Schema } from 'mongoose';
import { ITransaction } from '../types/index.js';

const transactionSchema = new Schema<ITransaction>({
  member: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['purchase', 'refund', 'adjustment'],
    required: true,
    default: 'purchase',
  },
  plan: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  tokens: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'mock'],
    required: true,
    default: 'mock',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    required: true,
    default: 'pending',
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
transactionSchema.index({ member: 1, createdAt: -1 });
transactionSchema.index({ paymentStatus: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema); 