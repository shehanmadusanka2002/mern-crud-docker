const { errorResponse } = require("../utils/response.util");

// Validate user input
const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  const errors = [];

  // Validate name
  if (!name || name.trim() === "") {
    errors.push("Name is required");
  } else if (name.length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (name.length > 50) {
    errors.push("Name cannot exceed 50 characters");
  }

  // Validate email
  if (!email || email.trim() === "") {
    errors.push("Email is required");
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push("Please provide a valid email address");
    }
  }

  // Validate age if provided
  if (req.body.age !== undefined) {
    const age = parseInt(req.body.age);
    if (isNaN(age) || age < 1 || age > 120) {
      errors.push("Age must be between 1 and 120");
    }
  }

  if (errors.length > 0) {
    return errorResponse(res, errors.join(", "), 400);
  }

  next();
};

module.exports = {
  validateUser,
};
