import mongoose, { Schema } from 'mongoose';
import { User } from './User.js';
import { IAdmin } from '../types/index.js';

const adminSchema = new Schema<IAdmin>({
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_gyms',
      'view_reports',
      'manage_transactions',
      'system_settings'
    ],
    default: ['manage_users', 'manage_gyms', 'view_reports', 'manage_transactions'],
  }],
});

export const Admin = User.discriminator<IAdmin>('admin', adminSchema); 