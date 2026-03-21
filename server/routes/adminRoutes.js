const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
  toggleAbsentStatusController,
  blockUserController // <--- THE MISSING IMPORT IS HERE!
} = require("../controllers/adminCtrl");

const router = express.Router();

// ==========================================
// ADMIN ROUTES
// ==========================================

// GET || GET ALL USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// GET || GET ALL DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// POST || CHANGE ACCOUNT STATUS
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController);

// POST || TOGGLE ABSENT STATUS
router.post("/toggleAbsentStatus", authMiddleware, toggleAbsentStatusController);

// POST || BLOCK USER
router.post("/blockUser", authMiddleware, blockUserController);

module.exports = router;