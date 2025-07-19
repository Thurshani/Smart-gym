import { Request, Response } from 'express';
import { User, Member, Gym, Admin } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { sendGymCredentials } from '../utils/email.js';
import { AuthRequest, LoginCredentials, RegisterMemberData, CreateGymData } from '../types/index.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role }: LoginCredentials = req.body;

    // Validate input
    if (!email || !password || !role) {
      res.status(400).json({
        success: false,
        message: 'Email, password, and role are required'
      });
      return;
    }

    // Find user by email and role
    const user = await User.findOne({ email: email.toLowerCase(), role });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const registerMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const memberData: RegisterMemberData = req.body;

    // Validate required fields
    if (!memberData.name || !memberData.email || !memberData.password) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: memberData.email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }

    // Create new member
    const member = new Member({
      ...memberData,
      email: memberData.email.toLowerCase(),
      role: 'member',
      tokens: 0 // Start with 0 tokens
    });

    await member.save();

    // Generate JWT token
    const token = generateToken(member._id, member.role);

    res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      data: {
        token,
        user: {
          id: member._id,
          email: member.email,
          name: member.name,
          role: member.role,
          tokens: member.tokens
        }
      }
    });
  } catch (error) {
    console.error('Member registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createGym = async (req: Request, res: Response): Promise<void> => {
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
    console.error('Gym creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    let userData;
    
    if (req.user.role === 'member') {
      userData = await Member.findById(req.user._id);
    } else if (req.user.role === 'gym') {
      userData = await Gym.findById(req.user._id);
    } else if (req.user.role === 'admin') {
      userData = await Admin.findById(req.user._id);
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user: userData }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 