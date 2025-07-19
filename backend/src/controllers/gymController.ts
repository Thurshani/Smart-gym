import { Response } from 'express';
import { Gym, Visit, Member } from '../models/index.js';
import { AuthRequest } from '../types/index.js';

export const getGymDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const gym = await Gym.findById(req.user._id);
    if (!gym) {
      res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
      return;
    }

    // Get visit statistics
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date(now);
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const thisMonth = new Date(now);
    thisMonth.setMonth(thisMonth.getMonth() - 1);
    
    const thisYear = new Date(now);
    thisYear.setFullYear(thisYear.getFullYear() - 1);

    const visitStats = {
      daily: await Visit.countDocuments({
        gym: gym._id,
        date: { $gte: today }
      }),
      weekly: await Visit.countDocuments({
        gym: gym._id,
        date: { $gte: thisWeek }
      }),
      monthly: await Visit.countDocuments({
        gym: gym._id,
        date: { $gte: thisMonth }
      }),
      yearly: await Visit.countDocuments({
        gym: gym._id,
        date: { $gte: thisYear }
      })
    };

    // Get recent visits
    const recentVisits = await Visit.find({ gym: gym._id })
      .populate('member', 'name email')
      .sort({ date: -1 })
      .limit(10);

    // Get unique members who visited
    const uniqueMembers = await Visit.distinct('member', { gym: gym._id });
    const totalMembers = uniqueMembers.length;

    res.json({
      success: true,
      message: 'Gym dashboard data retrieved successfully',
      data: {
        gym: {
          name: gym.name,
          gymCode: gym.gymCode,
          location: gym.location,
          capacity: gym.capacity,
          facilities: gym.facilities
        },
        visitStats,
        recentVisits,
        totalMembers
      }
    });
  } catch (error) {
    console.error('Get gym dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getVisitReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { period, format } = req.query as { period?: string; format?: string };
    const gym = await Gym.findById(req.user._id);
    
    if (!gym) {
      res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
      return;
    }

    // Calculate date range based on period
    let startDate: Date;
    const endDate = new Date();
    
    switch (period) {
      case 'daily':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
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

    const visits = await Visit.find({
      gym: gym._id,
      date: { $gte: startDate, $lte: endDate }
    })
    .populate('member', 'name email')
    .sort({ date: -1 });

    // Format response based on requested format
    if (format === 'csv') {
      const csvData = visits.map(visit => ({
        date: visit.date.toISOString().split('T')[0],
        time: visit.checkInTime.toLocaleTimeString(),
        memberName: (visit.member as any)?.name,
        memberEmail: (visit.member as any)?.email,
        tokensUsed: visit.tokensUsed
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=gym-visits-${period}.csv`);
      
      // Simple CSV conversion
      const csvHeaders = 'Date,Time,Member Name,Member Email,Tokens Used\n';
      const csvRows = csvData.map(row => 
        `${row.date},${row.time},${row.memberName},${row.memberEmail},${row.tokensUsed}`
      ).join('\n');
      
      res.send(csvHeaders + csvRows);
      return;
    }

    res.json({
      success: true,
      message: `${period} visit report generated successfully`,
      data: {
        period,
        dateRange: { startDate, endDate },
        totalVisits: visits.length,
        visits
      }
    });
  } catch (error) {
    console.error('Get visit reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getTodayVisits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const visits = await Visit.find({
      gym: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    })
    .populate('member', 'name email phone')
    .sort({ checkInTime: -1 });

    res.json({
      success: true,
      message: 'Today\'s visits retrieved successfully',
      data: {
        date: today.toISOString().split('T')[0],
        totalVisits: visits.length,
        visits
      }
    });
  } catch (error) {
    console.error('Get today visits error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 