const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} = require("../controllers/user.controller");
const { validateUser } = require("../middlewares/validate.middleware");

// Statistics route (must come before /:id route)
router.get("/stats", getUserStats);

// CRUD Routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validateUser, createUser);
router.put("/:id", validateUser, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
