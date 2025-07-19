import mongoose, { Schema } from 'mongoose';
import { User } from './User.js';
import { IMember } from '../types/index.js';

const memberSchema = new Schema<IMember>({
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  tokens: {
    type: Number,
    default: 0,
    min: 0,
  },
  subscription: {
    plan: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly'],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
});

// Index for efficient queries
memberSchema.index({ tokens: -1 });
memberSchema.index({ 'subscription.plan': 1, 'subscription.isActive': 1 });

export const Member = User.discriminator<IMember>('member', memberSchema); 