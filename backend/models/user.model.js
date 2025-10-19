const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: [1, "Age must be at least 1"],
      max: [120, "Age cannot exceed 120"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Index for faster email queries
userSchema.index({ email: 1 });

// Virtual for full user info
userSchema.virtual("userInfo").get(function () {
  return `${this.name} (${this.email})`;
});

// Method to get public profile (excluding sensitive data if any)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
