export interface PlatformStats {
  totalMembers: number;
  totalGyms: number;
  totalVisits: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

export interface Gym {
  _id: string;
  name: string;
  email: string;
  gymCode: string;
  location: {
    address: string;
    city?: string;
    state?: string;
  };
  capacity: number;
  facilities: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Member {
  _id: string;
  name: string;
  email: string;
  tokens: number;
  subscription: {
    plan: string;
    isActive: boolean;
    endDate: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface RecentVisit {
  _id: string;
  member: {
    name: string;
    email: string;
  };
  gym: {
    name: string;
    location: {
      address: string;
    };
  };
  date: string;
  checkInTime: string;
  tokensUsed: number;
}

export interface NewGymData {
  name: string;
  email: string;
  location: string;
  capacity: string;
  facilities: string;
} 