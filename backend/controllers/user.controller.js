const User = require("../models/user.model");
const { successResponse, errorResponse } = require("../utils/response.util");

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Build search query
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Pagination
    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    return successResponse(res, {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count,
    }, "Users fetched successfully");
  } catch (error) {
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "User with this email already exists", 400);
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      age,
    });

    await user.save();

    return successResponse(res, user, "User created successfully", 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, messages.join(", "), 400);
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

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return errorResponse(res, "Email already in use", 400);
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, age, isActive },
      { new: true, runValidators: true }
    );

    return successResponse(res, updatedUser, "User updated successfully");
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, messages.join(", "), 400);
    }
    if (error.kind === "ObjectId") {
      return errorResponse(res, "Invalid user ID", 400);
    }
    return errorResponse(res, error.message);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    await User.findByIdAndDelete(req.params.id);

    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
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
