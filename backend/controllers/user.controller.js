const User = require("../models/user.model");
const { successResponse, errorResponse } = require("../utils/response.util");

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Cap at 100

    // Build search query
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries in parallel for better performance
    const [users, count] = await Promise.all([
      User.find(query)
        .limit(limitNum)
        .skip((pageNum - 1) * limitNum)
        .sort(sort)
        .lean(), // Use lean() for better performance
      User.countDocuments(query)
    ]);

    return successResponse(res, {
      users,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      totalUsers: count,
    }, "Users fetched successfully");
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return errorResponse(res, error.message);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, user, "User fetched successfully");
  } catch (error) {
    if (error.kind === "ObjectId") {
      return errorResponse(res, "Invalid user ID", 400);
    }
    return errorResponse(res, error.message);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  try {
    const { name, email, phone, age } = req.body;

    // Input validation
    if (!name || !email) {
      return errorResponse(res, "Name and email are required", 400);
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, "Invalid email format", 400);
    }

    // Age validation
    if (age && (age < 0 || age > 150)) {
      return errorResponse(res, "Age must be between 0 and 150", 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, "User with this email already exists", 400);
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      age,
    });

    await user.save();

    return successResponse(res, user, "User created successfully", 201);
  } catch (error) {
    console.error('Error in createUser:', error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, messages.join(", "), 400);
    }
    if (error.code === 11000) {
      return errorResponse(res, "Email already exists", 400);
    }
    return errorResponse(res, error.message);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, age, isActive } = req.body;

    // Validate ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return errorResponse(res, "Invalid user ID", 400);
    }

    // Input validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return errorResponse(res, "Invalid email format", 400);
      }
    }

    if (age !== undefined && (age < 0 || age > 150)) {
      return errorResponse(res, "Age must be between 0 and 150", 400);
    }

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Check if email is being changed and if new email already exists
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return errorResponse(res, "Email already in use", 400);
      }
    }

    // Prepare update object
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (phone !== undefined) updateData.phone = phone?.trim();
    if (age !== undefined) updateData.age = age;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return successResponse(res, updatedUser, "User updated successfully");
  } catch (error) {
    console.error('Error in updateUser:', error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, messages.join(", "), 400);
    }
    if (error.kind === "ObjectId") {
      return errorResponse(res, "Invalid user ID", 400);
    }
    if (error.code === 11000) {
      return errorResponse(res, "Email already exists", 400);
    }
    return errorResponse(res, error.message);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return errorResponse(res, "Invalid user ID", 400);
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    console.error('Error in deleteUser:', error);
    if (error.kind === "ObjectId") {
      return errorResponse(res, "Invalid user ID", 400);
    }
    return errorResponse(res, error.message);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Public
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    return successResponse(res, {
      totalUsers,
      activeUsers,
      inactiveUsers,
    }, "User statistics fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
};
