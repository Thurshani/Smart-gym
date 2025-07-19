import { SubscriptionPlan } from '../types/index.js';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly Pass',
    tokens: 7,
    price: 29.99,
    duration: 7,
    popular: false
  },
  {
    id: 'monthly',
    name: 'Monthly Pass',
    tokens: 30,
    price: 99.99,
    duration: 30,
    popular: true
  },
  {
    id: 'yearly',
    name: 'Yearly Pass',
    tokens: 365,
    price: 999.99,
    duration: 365,
    popular: false
  }
];

export const DEFAULT_GYM_FACILITIES = [
  'Weight Training',
  'Cardio Equipment',
  'Free Weights',
  'Locker Room',
  'Parking'
];

export const DEFAULT_OPERATING_HOURS = {
  monday: { open: '06:00', close: '22:00' },
  tuesday: { open: '06:00', close: '22:00' },
  wednesday: { open: '06:00', close: '22:00' },
  thursday: { open: '06:00', close: '22:00' },
  friday: { open: '06:00', close: '22:00' },
  saturday: { open: '08:00', close: '20:00' },
  sunday: { open: '08:00', close: '20:00' }
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register-member',
    PROFILE: '/api/auth/profile'
  },
  MEMBER: {
    DASHBOARD: '/api/member/dashboard',
    SUBSCRIPTION_PLANS: '/api/member/subscription-plans',
    PURCHASE_SUBSCRIPTION: '/api/member/purchase-subscription',
    CHECK_IN: '/api/member/check-in',
    VISIT_HISTORY: '/api/member/visit-history'
  },
  GYM: {
    DASHBOARD: '/api/gym/dashboard',
    REPORTS: '/api/gym/reports',
    TODAY_VISITS: '/api/gym/today-visits'
  },
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    MEMBERS: '/api/admin/members',
    GYMS: '/api/admin/gyms',
    REPORTS: '/api/admin/reports'
  }
}; 