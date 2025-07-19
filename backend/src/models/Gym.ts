import mongoose, { Schema } from 'mongoose';
import { User } from './User.js';
import { IGym } from '../types/index.js';

const gymSchema = new Schema<IGym>({
  gymCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zipCode: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        min: -90,
        max: 90,
      },
      lng: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
  },
  facilities: [{
    type: String,
    trim: true,
  }],
  operatingHours: {
    monday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' },
    },
    tuesday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' },
    },
    wednesday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' },
    },
    thursday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' },
    },
    friday: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' },
    },
    saturday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '20:00' },
    },
    sunday: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '20:00' },
    },
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  phone: {
    type: String,
    trim: true,
  },
});

// Index for efficient queries
gymSchema.index({ 'location.city': 1, 'location.state': 1 });

export const Gym = User.discriminator<IGym>('gym', gymSchema); 