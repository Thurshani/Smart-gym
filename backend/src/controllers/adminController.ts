import { Response } from 'express';
import { User, Member, Gym, Visit, Transaction } from '../models/index.js';
import { AuthRequest, CreateGymData } from '../types/index.js';
import { sendGymCredentials } from '../utils/email.js';

export const getAdminDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Get platform statistics
    const totalMembers = await Member.countDocuments({ isActive: true });
    const totalGyms = await Gym.countDocuments({ isActive: true });
    const totalVisits = await Visit.countDocuments({});
    
    // Calculate total revenue from completed transactions
    const revenueResult = await Transaction.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get active subscriptions
    const activeSubscriptions = await Member.countDocuments({
      'subscription.isActive': true,
      'subscription.endDate': { $gt: new Date() }
    });

    // Get recent visits for overview
    const recentVisits = await Visit.find({})
      .populate('member', 'name email')
      .populate('gym', 'name location')
      .sort({ date: -1 })
      .limit(10);

    res.json({
      success: true,
      message: 'Admin dashboard data retrieved successfully',
      data: {
        stats: {
          totalMembers,
          totalGyms,
          totalVisits,
          totalRevenue,
          activeSubscriptions
        },
        recentVisits
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const skip = (page - 1) * limit;

    // Build query for search
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const members = await Member.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Member.countDocuments(query);

    res.json({
      success: true,
      message: 'Members retrieved successfully',
      data: {
        members,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalMembers: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all members error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllGyms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const skip = (page - 1) * limit;

    // Build query for search
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { gymCode: { $regex: search, $options: 'i' } }
      ];
    }

    const gyms = await Gym.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Gym.countDocuments(query);

    res.json({
      success: true,
      message: 'Gyms retrieved successfully',
      data: {
        gyms,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalGyms: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all gyms error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createGym = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const gymData: CreateGymData = req.body;

    // Validate required fields
    if (!gymData.name || !gymData.email || !gymData.location || !gymData.capacity) {
      res.status(400).json({
        success: false,
        message: 'Name, email, location, and capacity are required'
      });
      return;
    }

    // Check if gym already exists
    const existingGym = await User.findOne({ email: gymData.email.toLowerCase() });
    if (existingGym) {
      res.status(409).json({
        success: false,
        message: 'Gym with this email already exists'
      });
      return;
    }

    // Generate gym code
    const gymCode = `GYM${Date.now().toString().slice(-6)}`;
    
    // Generate temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8);

    // Create new gym
    const gym = new Gym({
      name: gymData.name,
      email: gymData.email.toLowerCase(),
      password: temporaryPassword,
      role: 'gym',
      gymCode,
      location: gymData.location,
      facilities: gymData.facilities || [],
      capacity: gymData.capacity,
      phone: gymData.phone
    });

    await gym.save();

    // Send credentials via email (mock)
    await sendGymCredentials(gym.email, gym.name, temporaryPassword);

    res.status(201).json({
      success: true,
      message: 'Gym created successfully. Credentials sent via email.',
      data: {
        gym: {
          id: gym._id,
          name: gym.name,
          email: gym.email,
          gymCode: gym.gymCode,
          location: gym.location
        }
      }
    });
  } catch (error) {
    console.error('Create gym error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { memberId } = req.params;
    const updateData = req.body;

    const member = await Member.findByIdAndUpdate(
      memberId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!member) {
      res.status(404).json({
        success: false,
        message: 'Member not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Member updated successfully',
      data: { member }
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateGym = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { gymId } = req.params;
    const updateData = req.body;

    const gym = await Gym.findByIdAndUpdate(
      gymId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!gym) {
      res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Gym updated successfully',
      data: { gym }
    });
  } catch (error) {
    console.error('Update gym error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deactivateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getGlobalReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { period } = req.query;

    // Calculate date range
    let startDate: Date;
    const endDate = new Date();
    
    switch (period) {
      case 'weekly':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'yearly':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Get visit statistics by gym
    const visitsByGym = await Visit.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$gym',
          totalVisits: { $sum: 1 },
          totalTokens: { $sum: '$tokensUsed' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'gym'
        }
      },
      {
        $unwind: '$gym'
      },
      {
        $project: {
          gymName: '$gym.name',
          gymCode: '$gym.gymCode',
          totalVisits: 1,
          totalTokens: 1
        }
      }
    ]);

    // Get revenue statistics
    const revenueStats = await Transaction.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$plan',
          totalRevenue: { $sum: '$amount' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      message: 'Global reports generated successfully',
      data: {
        period,
        dateRange: { startDate, endDate },
        visitsByGym,
        revenueStats
      }
    });
  } catch (error) {
    console.error('Get global reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 