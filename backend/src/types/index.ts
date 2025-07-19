import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  role: 'member' | 'gym' | 'admin';
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMember extends IUser {
  role: 'member';
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  tokens: number;
  subscription?: {
    plan: 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

export interface IGym extends IUser {
  role: 'gym';
  gymCode: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  facilities: string[];
  operatingHours: {
    monday: { open: string; close: string; };
    tuesday: { open: string; close: string; };
    wednesday: { open: string; close: string; };
    thursday: { open: string; close: string; };
    friday: { open: string; close: string; };
    saturday: { open: string; close: string; };
    sunday: { open: string; close: string; };
  };
  capacity: number;
  phone?: string;
}

export interface IAdmin extends IUser {
  role: 'admin';
  permissions: string[];
}

export interface IVisit extends Document {
  member: string; // ObjectId reference to Member
  gym: string; // ObjectId reference to Gym
  date: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  tokensUsed: number;
  notes?: string;
}

export interface ITransaction extends Document {
  member: string; // ObjectId reference to Member
  type: 'purchase' | 'refund' | 'adjustment';
  plan: 'weekly' | 'monthly' | 'yearly';
  amount: number;
  tokens: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'mock';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  description?: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
  query: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'member' | 'gym' | 'admin';
}

export interface RegisterMemberData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface CreateGymData {
  name: string;
  email: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  facilities: string[];
  capacity: number;
  phone?: string;
}

export interface SubscriptionPlan {
  id: 'weekly' | 'monthly' | 'yearly';
  name: string;
  tokens: number;
  price: number;
  duration: number; // days
  popular: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface VisitStats {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface DashboardStats {
  totalMembers: number;
  totalGyms: number;
  totalVisits: number;
  totalRevenue: number;
  activeSubscriptions: number;
  recentVisits: IVisit[];
} 