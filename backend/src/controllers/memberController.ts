import { Response } from 'express';
import { Member, Gym, Visit, Transaction } from '../models/index.js';
import { AuthRequest, SubscriptionPlan } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

const subscriptionPlans: SubscriptionPlan[] = [
  { id: 'weekly', name: 'Weekly Pass', tokens: 7, price: 29.99, duration: 7, popular: false },
  { id: 'monthly', name: 'Monthly Pass', tokens: 30, price: 99.99, duration: 30, popular: true },
  { id: 'yearly', name: 'Yearly Pass', tokens: 365, price: 999.99, duration: 365, popular: false },
];

export const getSubscriptionPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      message: 'Subscription plans retrieved successfully',
      data: { plans: subscriptionPlans }
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const purchaseSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { planId } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      res.status(400).json({
        success: false,
        message: 'Invalid subscription plan'
      });
      return;
    }

    const member = await Member.findById(req.user._id);
    if (!member) {
      res.status(404).json({
        success: false,
        message: 'Member not found'
      });
      return;
    }

    // Create transaction record
    const transaction = new Transaction({
      member: member._id,
      type: 'purchase',
      plan: plan.id,
      amount: plan.price,
      tokens: plan.tokens,
      paymentMethod: 'mock',
      paymentStatus: 'completed',
      transactionId: uuidv4(),
      description: `${plan.name} subscription purchase`
    });

    await transaction.save();

    // Update member's tokens and subscription
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    member.tokens += plan.tokens;
    member.subscription = {
      plan: plan.id,
      startDate,
      endDate,
      isActive: true
    };

    await member.save();

    res.json({
      success: true,
      message: 'Subscription purchased successfully',
      data: {
        transaction: {
          id: transaction._id,
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          tokens: transaction.tokens
        },
        member: {
          tokens: member.tokens,
          subscription: member.subscription
        }
      }
    });
  } catch (error) {
    console.error('Purchase subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const checkInToGym = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { gymId } = req.body; // This can now be a gym code or an ObjectId

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const member = await Member.findById(req.user._id);
    if (!member) {
      res.status(404).json({
        success: false,
        message: 'Member not found'
      });
      return;
    }

    // Find the gym by either its ID or its code
    const isObjectId = mongoose.Types.ObjectId.isValid(gymId);
    const gym = isObjectId
      ? await Gym.findById(gymId)
      : await Gym.findOne({ gymCode: gymId.toUpperCase() });

    if (!gym) {
      res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
      return;
    }

    // Check if member has tokens
    if (member.tokens <= 0) {
      res.status(400).json({
        success: false,
        message: 'Insufficient tokens. Please purchase a subscription.'
      });
      return;
    }

    // Check if already visited this gym today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const existingVisit = await Visit.findOne({
      member: member._id,
      gym: gym._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingVisit) {
      res.json({
        success: true,
        message: 'Already checked in to this gym today',
        data: { visit: existingVisit }
      });
      return;
    }

    // Create new visit record
    const visit = new Visit({
      member: member._id,
      gym: gym._id,
      date: new Date(),
      checkInTime: new Date(),
      tokensUsed: 1
    });

    await visit.save();

    // Deduct token from member
    member.tokens -= 1;
    await member.save();

    // Populate the visit data for response
    await visit.populate('gym', 'name location');

    res.json({
      success: true,
      message: 'Check-in successful',
      data: {
        visit,
        remainingTokens: member.tokens
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getMemberDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const member = await Member.findById(req.user._id);
    if (!member) {
      res.status(404).json({
        success: false,
        message: 'Member not found'
      });
      return;
    }

    // Get recent visits
    const recentVisits = await Visit.find({ member: member._id })
      .populate('gym', 'name location')
      .sort({ date: -1 })
      .limit(10);

    // Get unique recent gyms from the visits to avoid a second DB call
    const recentGymsMap = new Map();
    recentVisits.forEach(visit => {
      const gym = visit.gym as any; // Cast to access populated properties
      if (gym && gym._id && !recentGymsMap.has(gym._id.toString())) {
        recentGymsMap.set(gym._id.toString(), gym);
      }
    });
    const recentGyms = Array.from(recentGymsMap.values()).slice(0, 5);

    // Get visit statistics
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const thisWeek = new Date(now.setDate(now.getDate() - 7));
    const thisMonth = new Date(now.setMonth(now.getMonth() - 1));
    const thisYear = new Date(now.setFullYear(now.getFullYear() - 1));

    const visitStats = {
      today: await Visit.countDocuments({
        member: member._id,
        date: { $gte: today }
      }),
      thisWeek: await Visit.countDocuments({
        member: member._id,
        date: { $gte: thisWeek }
      }),
      thisMonth: await Visit.countDocuments({
        member: member._id,
        date: { $gte: thisMonth }
      }),
      thisYear: await Visit.countDocuments({
        member: member._id,
        date: { $gte: thisYear }
      })
    };

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        member: {
          name: member.name,
          email: member.email,
          tokens: member.tokens,
          subscription: member.subscription
        },
        recentVisits,
        recentGyms,
        visitStats,
        subscriptionPlans
      }
    });
  } catch (error) {
    console.error('Get member dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getVisitHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const visits = await Visit.find({ member: req.user._id })
      .populate('gym', 'name location')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Visit.countDocuments({ member: req.user._id });

    res.json({
      success: true,
      message: 'Visit history retrieved successfully',
      data: {
        visits,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalVisits: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get visit history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 